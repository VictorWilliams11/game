import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen, Plus, Trash2 } from "lucide-react"

export default async function AdminNotesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all notes with related data
  const { data: notes } = await supabase
    .from("study_notes")
    .select("*, subjects(name), exam_types(name)")
    .order("created_at", { ascending: false })

  const handleDelete = async (noteId: string) => {
    "use server"
    const supabase = await createClient()
    await supabase.from("study_notes").delete().eq("id", noteId)
    redirect("/admin-secure-portal/notes")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button asChild variant="ghost" className="mb-6 text-white hover:bg-slate-700">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Study Notes</h1>
            <p className="text-slate-300">Add and manage study materials for students</p>
          </div>
          <Button asChild>
            <Link href="/admin-secure-portal/notes/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Note
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {notes?.map((note) => (
            <Card key={note.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      {note.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {note.exam_types?.name} - {note.subjects?.name}
                    </CardDescription>
                  </div>
                  <form
                    action={async () => {
                      "use server"
                      await handleDelete(note.id)
                    }}
                  >
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 line-clamp-2">{note.content}</p>
                <p className="text-xs text-slate-500 mt-2">Created: {new Date(note.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}

          {(!notes || notes.length === 0) && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No study notes added yet. Click "Add New Note" to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
