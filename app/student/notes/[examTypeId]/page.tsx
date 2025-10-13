import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

export default async function ExamNotesPage({ params }: { params: { examTypeId: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch exam type
  const { data: examType } = await supabase.from("exam_types").select("*").eq("id", params.examTypeId).single()

  // Fetch subjects for this exam type
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .eq("exam_type_id", params.examTypeId)
    .order("name")

  // Fetch notes count for each subject
  const subjectsWithNotes = await Promise.all(
    (subjects || []).map(async (subject) => {
      const { count } = await supabase
        .from("study_notes")
        .select("*", { count: "exact", head: true })
        .eq("subject_id", subject.id)
      return { ...subject, notesCount: count || 0 }
    }),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/student/notes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exam Types
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">{examType?.name} Study Materials</h1>
          <p className="text-muted-foreground">Select a subject to view notes and literature</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {subjectsWithNotes.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  {subject.name}
                </CardTitle>
                <CardDescription>{subject.notesCount} study material(s) available</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" disabled={subject.notesCount === 0}>
                  <Link href={`/student/notes/${params.examTypeId}/${subject.id}`}>
                    {subject.notesCount > 0 ? "View Notes" : "No Notes Available"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
