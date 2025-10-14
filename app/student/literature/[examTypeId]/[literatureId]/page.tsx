import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, User, BookOpen } from "lucide-react"

export default async function LiteratureReadPage({
  params,
}: {
  params: Promise<{ examTypeId: string; literatureId: string }>
}) {
  const supabase = await createClient()
  const { examTypeId, literatureId } = await params

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: literature } = await supabase
    .from("literature")
    .select(`
      *,
      subjects (name),
      exam_types (name)
    `)
    .eq("id", literatureId)
    .single()

  if (!literature) {
    redirect(`/student/literature/${examTypeId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/student/literature/${examTypeId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {literature.exam_types.name} Literature
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{literature.title}</CardTitle>
                {literature.author && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {literature.author}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <Badge>{literature.exam_types.name}</Badge>
                  {literature.subjects && <Badge variant="outline">{literature.subjects.name}</Badge>}
                </div>
              </div>
            </div>
            {literature.description && <p className="text-muted-foreground">{literature.description}</p>}
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue max-w-none">
              <div className="whitespace-pre-wrap text-base leading-relaxed">{literature.content}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
