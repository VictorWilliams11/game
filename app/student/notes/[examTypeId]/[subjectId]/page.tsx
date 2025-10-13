import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default async function SubjectNotesPage({ params }: { params: { examTypeId: string; subjectId: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch subject and exam type
  const { data: subject } = await supabase
    .from("subjects")
    .select("*, exam_types(name)")
    .eq("id", params.subjectId)
    .single()

  // Fetch all notes for this subject
  const { data: notes } = await supabase
    .from("study_notes")
    .select("*")
    .eq("subject_id", params.subjectId)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/student/notes/${params.examTypeId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">{subject?.name}</h1>
          <p className="text-muted-foreground">{subject?.exam_types?.name} Study Materials</p>
        </div>

        <div className="space-y-6">
          {notes?.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  {note.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none mb-4">
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(note.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}

          {(!notes || notes.length === 0) && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No study materials available yet for this subject.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
