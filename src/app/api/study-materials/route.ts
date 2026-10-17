import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { deskStudyMaterials } from "@/lib/mock-data"
import { StudyMaterial } from "@/types/desk"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")
    const semester = searchParams.get("semester")
    const ia = searchParams.get("ia")
    const query = searchParams.get("q")?.toLowerCase()

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Attempt to query live Supabase PostgreSQL table
    let queryBuilder = supabase.from("study_materials").select("*")

    if (subject && subject !== "all") {
      queryBuilder = queryBuilder.eq("subject", subject)
    }
    if (semester && semester !== "all") {
      queryBuilder = queryBuilder.eq("semester", semester)
    }
    if (ia && ia !== "all") {
      queryBuilder = queryBuilder.eq("ia", ia)
    }
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`)
    }

    const { data: dbData, error: dbError } = await queryBuilder

    // If table exists and returned data
    if (!dbError && dbData && dbData.length > 0) {
      const mapped: StudyMaterial[] = (dbData as Record<string, unknown>[]).map((row) => ({

        id: String(row.id),
        workspaceId: String(row.workspace_id || ""),
        title: String(row.title || ""),
        subject: String(row.subject || ""),
        semester: String(row.semester || ""),
        ia: (row.ia as StudyMaterial["ia"]) || "IA-1",
        storagePath: String(row.storage_path || ""),
        fileName: String(row.file_name || ""),
        fileSizeBytes: Number(row.file_size_bytes) || 0,
        fileType: String(row.file_type || "application/pdf"),
        pageCount: row.page_count ? Number(row.page_count) : undefined,
        uploadedBy: (row.uploaded_by as StudyMaterial["uploadedBy"]) || {
          name: "Faculty / Lead",
          avatar: "FL",
          role: "Academic Admin",
        },
        description: row.description ? String(row.description) : undefined,
        tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
        createdAt: String(row.created_at || new Date().toISOString()),
        updatedAt: row.updated_at ? String(row.updated_at) : undefined,
      }))


      return NextResponse.json({
        data: mapped,
        source: "supabase_postgresql",
        total: mapped.length,
      })
    }

    // Graceful fallback: If table is not yet migrated in Supabase (or empty during onboarding)
    let filtered = [...deskStudyMaterials]

    if (subject && subject !== "all") {
      filtered = filtered.filter((m) => m.subject.toLowerCase() === subject.toLowerCase())
    }
    if (semester && semester !== "all") {
      filtered = filtered.filter((m) => m.semester.toLowerCase() === semester.toLowerCase())
    }
    if (ia && ia !== "all") {
      filtered = filtered.filter((m) => m.ia.toLowerCase() === ia.toLowerCase())
    }
    if (query) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.subject.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query) ||
          m.tags?.some((t) => t.toLowerCase().includes(query))
      )
    }

    const isMissingTable = dbError && dbError.code === "PGRST205"

    return NextResponse.json({
      data: filtered,
      source: "seed_fallback",
      databaseStatus: isMissingTable ? "table_pending_migration" : "live_ready",
      message: isMissingTable
        ? "Supabase study_materials table has not yet been applied. Displaying structured seed records."
        : "Displaying available study materials.",
      total: filtered.length,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to fetch study materials",
        details: message,
        data: deskStudyMaterials,
        source: "seed_fallback",
      },
      { status: 200 }
    )
  }
}

