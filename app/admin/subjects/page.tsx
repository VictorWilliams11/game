import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AdminSubjectsPage() {
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

  // Fetch exam types with subjects
  const { data: examTypes } = await supabase
    .from("exam_types")
    .select(`
      *,
      subjects (*)
    `)
    .order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Subjects</h1>
          <p className="text-muted-foreground">View all subjects by exam type</p>
        </div>

        <div className="space-y-6">
          {examTypes?.map((examType: any) => (
            <Card key={examType.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {examType.name}
                  <Badge variant="secondary">{examType.subjects?.length || 0} subjects</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {examType.subjects?.map((subject: any) => (
                    <Badge key={subject.id} variant="outline" className="text-sm py-1 px-3">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
