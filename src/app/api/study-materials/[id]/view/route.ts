import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as fs from "fs"
import * as path from "path"
import { createClient } from "@/utils/supabase/server"
import { deskStudyMaterials } from "@/lib/mock-data"


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    const asUrl = searchParams.get("format") === "url"

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    interface MaterialMeta {
      id: string
      title: string
      subject: string
      semester: string
      ia: string
      storagePath?: string
      fileName?: string
      description?: string
    }

    // 1. Fetch metadata from DB or fallback
    let material: MaterialMeta | null = null

    const { data: dbData } = await supabase
      .from("study_materials")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (dbData) {
      const record = dbData as Record<string, unknown>
      material = {
        id: String(record.id),
        title: String(record.title || ""),
        subject: String(record.subject || ""),
        semester: String(record.semester || ""),
        ia: String(record.ia || ""),
        storagePath: record.storage_path ? String(record.storage_path) : undefined,
        fileName: record.file_name ? String(record.file_name) : undefined,
        description: record.description ? String(record.description) : "",
      }
    } else {
      const found = deskStudyMaterials.find((m) => m.id === id)
      if (found) {
        material = {
          id: found.id,
          title: found.title,
          subject: found.subject,
          semester: found.semester,
          ia: found.ia,
          storagePath: found.storagePath,
          fileName: found.fileName,
          description: found.description || "",
        }
      }
    }

    if (!material) {
      return NextResponse.json({ error: "Study material not found" }, { status: 404 })
    }

    // 2. Check if local PDF file exists in public/study-materials/ia-1-prep/
    if (material.fileName) {
      const localFilePath = path.join(process.cwd(), "public", "study-materials", "ia-1-prep", material.fileName)
      if (fs.existsSync(localFilePath)) {
        if (asUrl) {
          return NextResponse.json({
            signedUrl: `/study-materials/ia-1-prep/${encodeURIComponent(material.fileName)}`,
            expiresInSeconds: 3600,
            protected: true,
            title: material.title,
            storageType: "local_ia_prep_store",
          })
        }
        const fileBytes = fs.readFileSync(localFilePath)
        return new NextResponse(new Uint8Array(fileBytes), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${material.fileName}"`,
            "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
            "X-Content-Type-Options": "nosniff",
          },
        })
      }
    }

    // 3. Try to get a short-lived signed URL (60 seconds) from Supabase Storage
    if (material.storagePath) {

      const { data: signedData, error: signedError } = await supabase.storage
        .from("study-materials")
        .createSignedUrl(material.storagePath, 60)

      if (!signedError && signedData?.signedUrl) {
        if (asUrl) {
          return NextResponse.json({
            signedUrl: signedData.signedUrl,
            expiresInSeconds: 60,
            protected: true,
            title: material.title,
            storageType: "supabase_storage_signed",
          })
        }

        // Redirect to signed URL
        return NextResponse.redirect(signedData.signedUrl)
      }
    }

    // 3. Return explicit error when file is missing from both local store and Supabase Storage
    return NextResponse.json(
      {
        error: "File not found in storage",
        documentId: material.id,
        fileName: material.fileName,
        storagePath: material.storagePath,
        message: "This document binary has not yet been uploaded to the Supabase storage vault.",
      },
      { status: 404 }
    )

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to authorize document view", details: message },
      { status: 500 }
    )
  }
}

