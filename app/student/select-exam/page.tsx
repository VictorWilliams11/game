import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ExamTypeSelector } from "@/components/student/exam-type-selector"

export default async function SelectExamPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch exam types
  const { data: examTypes } = await supabase.from("exam_types").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Select Exam Type</h1>
          <p className="text-muted-foreground">Choose which exam you want to practice for</p>
        </div>

        <ExamTypeSelector examTypes={examTypes || []} />
      </div>
    </div>
  )
}
