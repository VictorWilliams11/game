import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const supabase = await createClient()
    const { sessionId } = await params

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the exam session belongs to the user
    const { data: session, error: sessionError } = await supabase
      .from("exam_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .eq("user_id", userData.user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Exam session not found" }, { status: 404 })
    }

    // Delete the exam session (cascade will delete exam_answers)
    const { error: deleteError } = await supabase.from("exam_sessions").delete().eq("id", sessionId)

    if (deleteError) {
      console.error("[v0] Error deleting exam session:", deleteError)
      return NextResponse.json({ error: "Failed to delete exam session" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Exam result deleted successfully" })
  } catch (error) {
    console.error("[v0] Unexpected error in DELETE /api/results:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
