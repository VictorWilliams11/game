import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SubjectSelector } from "@/components/student/subject-selector"

export default async function SelectSubjectPage({
  searchParams,
}: {
  searchParams: Promise<{ examTypeId?: string; examTypeName?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  if (!params.examTypeId) {
    redirect("/student/select-exam")
  }

  const { data: examType } = await supabase.from("exam_types").select("*").eq("id", params.examTypeId).single()

  // Fetch subjects for the selected exam type
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .eq("exam_type_id", params.examTypeId)
    .order("name")

  // Get question count for each subject
  const subjectsWithCount = await Promise.all(
    (subjects || []).map(async (subject) => {
      const { count } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("subject_id", subject.id)

      return {
        ...subject,
        questionCount: count || 0,
      }
    }),
  )

  const maxSubjects = examType?.name === "JAMB" ? 4 : 9

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/student/select-exam">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exam Selection
          </Link>
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Select Subjects</h1>
          <p className="text-muted-foreground">
            Choose up to <span className="font-semibold">{maxSubjects} subjects</span> for{" "}
            <span className="font-semibold">{params.examTypeName}</span>
          </p>
        </div>

        <SubjectSelector
          subjects={subjectsWithCount}
          examTypeId={params.examTypeId}
          examTypeName={params.examTypeName || ""}
          maxSubjects={maxSubjects}
        />
      </div>
    </div>
  )
}
