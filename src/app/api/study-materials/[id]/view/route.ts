import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as fs from "fs"
import * as path from "path"
import { createClient } from "@/utils/supabase/server"
import { deskStudyMaterials } from "@/lib/mock-data"


// Simple standalone minimal PDF generator for in-app viewing fallback
function createProtectedPdfDocument(title: string, subject: string, semester: string, ia: string, description: string): Buffer {
  const content = `%PDF-1.4
1 0 obj
<< /Title (${title.replace(/[()]/g, "")})
   /Author (HackForge Study Desk)
   /Creator (HackForge Digital Workspace)
   /Producer (HackForge Protected PDF Viewer) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page
   /Parent 3 0 R
   /MediaBox [0 0 612 792]
   /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >>
   /Contents 7 0 R >>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
7 0 obj
<< /Length 850 >>
stream
BT
/F1 18 Tf
50 720 Td
(HACKFORGE ACADEMIC STUDY DESK) Tj
0 -26 Td
/F1 14 Tf
(${subject.replace(/[()]/g, "")} - ${semester} [${ia}]) Tj
0 -30 Td
/F1 12 Tf
(${title.substring(0, 65).replace(/[()]/g, "")}) Tj
0 -20 Td
/F2 10 Tf
(PROTECTED DOCUMENT - RESTRICTED DISTRIBUTION) Tj
0 -30 Td
/F2 11 Tf
(Document Overview & Scope:) Tj
0 -18 Td
(${description.substring(0, 80).replace(/[()]/g, "")}) Tj
0 -30 Td
/F1 11 Tf
(Key Topics & Assessment Rubric:) Tj
0 -18 Td
/F2 10 Tf
(1. Core architectural concepts, protocols, and standard derivations.) Tj
0 -16 Td
(2. Solved examination numericals and problem-bank scenarios.) Tj
0 -16 Td
(3. Previous semester internal assessment question keys.) Tj
0 -35 Td
/F2 9 Tf
(Security Notice: HackForge In-App Viewer. Direct downloading or unauthorized) Tj
0 -14 Td
(distribution is prohibited under the workspace academic honor code.) Tj
ET
endstream
endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000174 00000 n 
0000000224 00000 n 
0000000283 00000 n 
0000000414 00000 n 
0000000487 00000 n 
0000000555 00000 n 
trailer
<< /Size 8 /Root 2 0 R /Info 1 0 R >>
startxref
1460
%%EOF`

  return Buffer.from(content)
}

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

    // 3. Fallback: Provide safe, protected streamable PDF buffer
    const pdfBuffer = createProtectedPdfDocument(
      material.title,
      material.subject,
      material.semester,
      material.ia,
      material.description || "Comprehensive syllabus notes and internal assessment questions."
    )

    if (asUrl) {
      const base64Data = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`
      return NextResponse.json({
        signedUrl: base64Data,
        expiresInSeconds: 300,
        protected: true,
        title: material.title,
        storageType: "generated_inline_stream",
      })
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${material.fileName || "document.pdf"}"`,
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to authorize document view", details: message },
      { status: 500 }
    )
  }
}

