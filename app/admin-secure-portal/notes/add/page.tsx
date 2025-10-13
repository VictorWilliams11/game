import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default async function AddNotePage() {
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

  // Fetch exam types and subjects
  const { data: examTypes } = await supabase.from("exam_types").select("*").order("name")
  const { data: subjects } = await supabase.from("subjects").select("*, exam_types(name)").order("name")

  const handleSubmit = async (formData: FormData) => {
    "use server"
    const supabase = await createClient()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const examTypeId = formData.get("examTypeId") as string
    const subjectId = formData.get("subjectId") as string

    const { data: userData } = await supabase.auth.getUser()

    await supabase.from("study_notes").insert({
      title,
      content,
      exam_type_id: examTypeId,
      subject_id: subjectId,
      created_by: userData.user?.id,
    })

    redirect("/admin-secure-portal/notes")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button asChild variant="ghost" className="mb-6 text-white hover:bg-slate-700">
          <Link href="/admin-secure-portal/notes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Link>
        </Button>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add Study Note</CardTitle>
            <CardDescription className="text-slate-400">Create new study material for students</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Introduction to Algebra"
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examTypeId" className="text-white">
                  Exam Type
                </Label>
                <select
                  id="examTypeId"
                  name="examTypeId"
                  required
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                >
                  <option value="">Select exam type</option>
                  {examTypes?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectId" className="text-white">
                  Subject
                </Label>
                <select
                  id="subjectId"
                  name="subjectId"
                  required
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                >
                  <option value="">Select subject</option>
                  {subjects?.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.exam_types?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-white">
                  Content
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter the study material content here..."
                  required
                  rows={12}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Button type="submit" className="w-full">
                Add Study Note
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
