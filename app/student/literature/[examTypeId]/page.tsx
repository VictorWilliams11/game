import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, BookOpen, User } from "lucide-react"

export default async function ExamLiteraturePage({ params }: { params: Promise<{ examTypeId: string }> }) {
  const supabase = await createClient()
  const { examTypeId } = await params

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: examType } = await supabase.from("exam_types").select("*").eq("id", examTypeId).single()

  if (!examType) {
    redirect("/student/literature")
  }

  const { data: literature } = await supabase
    .from("literature")
    .select(`
      *,
      subjects (name)
    `)
    .eq("exam_type_id", examTypeId)
    .order("title")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/student/literature">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Literature
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">{examType.name} Literature</h1>
          <p className="text-muted-foreground">Browse and read novels and literature materials</p>
        </div>

        {literature && literature.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {literature.map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="line-clamp-2">{item.title}</span>
                    </span>
                  </CardTitle>
                  {item.author && (
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {item.author}
                    </CardDescription>
                  )}
                  {item.subjects && (
                    <Badge variant="outline" className="w-fit">
                      {item.subjects.name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                  )}
                  <Button asChild className="w-full">
                    <Link href={`/student/literature/${examTypeId}/${item.id}`}>Read Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No literature available yet for {examType.name}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
