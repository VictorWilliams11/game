import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, BookOpen, Trash2, User } from "lucide-react"

export default async function AdminLiteraturePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: literature } = await supabase
    .from("literature")
    .select(`
      *,
      exam_types (name),
      subjects (name)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Literature</h1>
            <p className="text-slate-300">Add and manage novels and literature materials</p>
          </div>
          <Button asChild>
            <Link href="/admin-secure-portal/literature/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Literature
            </Link>
          </Button>
        </div>

        {literature && literature.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {literature.map((item: any) => (
              <Card key={item.id}>
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
                  <div className="flex gap-2 mt-2">
                    <Badge>{item.exam_types.name}</Badge>
                    {item.subjects && <Badge variant="outline">{item.subjects.name}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/student/literature/${item.exam_type_id}/${item.id}`}>View</Link>
                    </Button>
                    <form
                      action={async () => {
                        "use server"
                        const supabase = await createClient()
                        await supabase.from("literature").delete().eq("id", item.id)
                        redirect("/admin-secure-portal/literature")
                      }}
                    >
                      <Button type="submit" variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No literature added yet</p>
              <Button asChild>
                <Link href="/admin-secure-portal/literature/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Literature
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
