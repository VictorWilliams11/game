import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, FileQuestion, LogOut, User, Users, Library } from "lucide-react"
import { Leaderboard } from "@/components/leaderboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const isAdmin = profile?.role === "admin"

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || data.user.email}</p>
          </div>
          <form action={handleSignOut}>
            <Button variant="outline" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <User className="h-4 w-4" />
            {isAdmin ? "Administrator" : "Student"}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {isAdmin ? (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-blue-600" />
                    Manage Questions
                  </CardTitle>
                  <CardDescription>Add, edit, and organize exam questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin-secure-portal/questions">Go to Questions</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Manage Subjects & Exams
                  </CardTitle>
                  <CardDescription>Add exam types and manage subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/admin-secure-portal/subjects">Manage Subjects</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    User Management
                  </CardTitle>
                  <CardDescription>View and manage all registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/admin-secure-portal/users">View Users</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    Manage Study Notes
                  </CardTitle>
                  <CardDescription>Add and manage study materials for students</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/admin-secure-portal/notes">Manage Notes</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-5 w-5 text-orange-600" />
                    Manage Literature
                  </CardTitle>
                  <CardDescription>Add and manage novels and literature materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/admin-secure-portal/literature">Manage Literature</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Start Practice
                  </CardTitle>
                  <CardDescription>Choose an exam and subject to practice</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/student/select-exam">Start Exam</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-purple-600" />
                    My Results
                  </CardTitle>
                  <CardDescription>View your past exam results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/student/results">View Results</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    Study Notes
                  </CardTitle>
                  <CardDescription>Read notes and study materials for your exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/student/notes">View Study Materials</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-5 w-5 text-orange-600" />
                    Literature & Novels
                  </CardTitle>
                  <CardDescription>Browse and read literature materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/student/literature">Browse Literature</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {!isAdmin && (
          <div className="mt-8">
            <Leaderboard limit={10} />
          </div>
        )}
      </div>
    </div>
  )
}
