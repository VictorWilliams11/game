import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AddQuestionForm } from "@/components/admin/add-question-form"

export default async function AddQuestionPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch exam types and subjects
  const { data: examTypes } = await supabase.from("exam_types").select("*").order("name")

  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin-secure-portal/questions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Add New Question</h1>
          <p className="text-muted-foreground">Create a new exam question</p>
        </div>

        <AddQuestionForm examTypes={examTypes || []} subjects={subjects || []} />
      </div>
    </div>
  )
}
