import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"
import { QuestionsList } from "@/components/admin/questions-list"

export default async function AdminQuestionsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch questions with subject and exam type info
  const { data: questions } = await supabase
    .from("questions")
    .select(`
      *,
      subjects (
        name,
        exam_types (name)
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Manage Questions</h1>
              <p className="text-muted-foreground">Add and manage exam questions</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/admin-secure-portal/questions/add-bulk">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Multiple
                </Link>
              </Button>
              <Button asChild>
                <Link href="/admin-secure-portal/questions/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <QuestionsList questions={questions || []} />
      </div>
    </div>
  )
}
