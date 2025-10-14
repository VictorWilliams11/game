import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, User, BookOpen, Download, FileText } from "lucide-react"

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
            {literature.pdf_url && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">PDF Document Available</span>
                  </div>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <a href={literature.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </div>

                {/* PDF Viewer */}
                <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-gray-100">
                  <iframe src={`${literature.pdf_url}#toolbar=1`} className="w-full h-full" title={literature.title} />
                </div>
              </div>
            )}

            {literature.content && (
              <div className="prose prose-blue max-w-none">
                {literature.pdf_url && <h3 className="text-lg font-semibold mb-3 mt-6">Additional Text Content</h3>}
                <div className="whitespace-pre-wrap text-base leading-relaxed">{literature.content}</div>
              </div>
            )}

            {!literature.pdf_url && !literature.content && (
              <p className="text-center text-muted-foreground py-8">No content available for this literature.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
