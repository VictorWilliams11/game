import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"

export default async function LiteraturePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: examTypes } = await supabase.from("exam_types").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Literature & Novels</h1>
          <p className="text-muted-foreground">Browse and read literature materials for your exams</p>
        </div>

        <div className="grid gap-6">
          {examTypes?.map((examType) => (
            <Card key={examType.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  {examType.name} Literature
                </CardTitle>
                <CardDescription>Browse novels and literature for {examType.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/student/literature/${examType.id}`}>View Literature</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
