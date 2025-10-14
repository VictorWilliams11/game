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
  const subjectNameArray = params.subjectNames?.split(",") || []

  const { data: subjects } = await supabase.from("subjects").select("id, name").in("id", subjectIdArray)

  if (!subjects || subjects.length === 0) {
    redirect("/student/select-exam")
  }

  const subjectsWithQuestions = await Promise.all(
    subjects.map(async (subject) => {
      const { data: questions } = await supabase
        .from("questions")
        .select("*")
        .eq("subject_id", subject.id)
        .order("created_at")

      // Randomly shuffle and take up to 50 questions
      const shuffled = questions?.sort(() => Math.random() - 0.5) || []
      const selectedQuestions = shuffled.slice(0, 50)

      return {
        id: subject.id,
        name: subject.name,
        questions: selectedQuestions,
      }
    }),
  )

  const totalQuestions = subjectsWithQuestions.reduce((sum, s) => sum + s.questions.length, 0)

  if (totalQuestions === 0) {
    redirect("/student/select-exam")
  }

  const { data: session, error: sessionError } = await supabase
    .from("exam_sessions")
    .insert({
      user_id: data.user.id,
      exam_type_id: params.examTypeId,
      subject_id: subjectIdArray[0],
      duration_minutes: 60,
      total_questions: totalQuestions,
    })
    .select()
    .single()

  if (sessionError || !session) {
    redirect("/student/select-exam")
  }

  const subjectInserts = subjectsWithQuestions.map((subject) => ({
    exam_session_id: session.id,
    subject_id: subject.id,
    questions_count: subject.questions.length,
    correct_answers: 0,
  }))

  await supabase.from("exam_session_subjects").insert(subjectInserts)

  return <ExamInterface subjectsWithQuestions={subjectsWithQuestions} sessionId={session.id} userId={data.user.id} />
}
