import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ExamInterface } from "@/components/student/exam-interface"

export default async function ExamPage({
  searchParams,
}: {
  searchParams: Promise<{ examTypeId?: string; subjectIds?: string; subjectNames?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  if (!params.examTypeId || !params.subjectIds) {
    redirect("/student/select-exam")
  }

  const subjectIdArray = params.subjectIds.split(",")

  // Fetch questions for all selected subjects
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .in("subject_id", subjectIdArray)
    .order("created_at")

  if (!questions || questions.length === 0) {
    redirect("/student/select-exam")
  }

  const { data: session, error: sessionError } = await supabase
    .from("exam_sessions")
    .insert({
      user_id: data.user.id,
      exam_type_id: params.examTypeId,
      subject_id: subjectIdArray[0], // Store first subject for compatibility
      duration_minutes: 60,
      total_questions: questions.length,
    })
    .select()
    .single()

  if (sessionError || !session) {
    redirect("/student/select-exam")
  }

  return (
    <ExamInterface
      questions={questions}
      sessionId={session.id}
      subjectName={params.subjectNames || ""}
      userId={data.user.id}
    />
  )
}
