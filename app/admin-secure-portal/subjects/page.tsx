import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, BookOpen, Plus } from "lucide-react"

export default async function AdminSubjectsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: examTypes } = await supabase.from("exam_types").select("*").order("name")

  // Fetch subjects with exam type info
  const { data: subjects } = await supabase
    .from("subjects")
    .select(`
      *,
      exam_types (name)
    `)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Manage Subjects & Exams</h1>
              <p className="text-muted-foreground">Add and manage exam types and subjects</p>
            </div>
            <Button asChild>
              <Link href="/admin-secure-portal/subjects/add">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Exam Types</h2>
            <div className="flex flex-wrap gap-3">
              {examTypes?.map((exam) => (
                <Badge key={exam.id} variant="secondary" className="text-base py-2 px-4">
                  {exam.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-blue-900 mb-4">All Subjects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectsWithCount.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      {subject.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{subject.exam_types?.name}</p>
                  </div>
                  <Badge variant="secondary">{subject.questionCount} questions</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
