import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, Users, Mail, Calendar, Activity } from "lucide-react"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  const {
    data: { users: authUsers },
  } = await supabase.auth.admin.listUsers()

  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const usersWithStats = await Promise.all(
    (profiles || []).map(async (profile) => {
      const authUser = authUsers?.find((u) => u.id === profile.id)

      const { count } = await supabase
        .from("exam_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id)

      const lastSignIn = authUser?.last_sign_in_at ? new Date(authUser.last_sign_in_at) : null
      const isActive = lastSignIn ? Date.now() - lastSignIn.getTime() < 24 * 60 * 60 * 1000 : false

      return {
        ...profile,
        email: authUser?.email || profile.email,
        lastSignIn,
        isActive,
        examCount: count || 0,
      }
    }),
  )

  const studentCount = usersWithStats.filter((u) => u.role === "student").length
  const adminCount = usersWithStats.filter((u) => u.role === "admin").length
  const activeCount = usersWithStats.filter((u) => u.isActive).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">User Management</h1>
          <p className="text-muted-foreground">View and manage all registered users</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Badge variant="secondary" className="text-base py-2 px-4">
              <Users className="h-4 w-4 mr-2" />
              Total: {usersWithStats.length}
            </Badge>
            <Badge className="text-base py-2 px-4 bg-green-600">
              <Activity className="h-4 w-4 mr-2" />
              Active: {activeCount}
            </Badge>
            <Badge className="text-base py-2 px-4 bg-blue-600">Students: {studentCount}</Badge>
            <Badge className="text-base py-2 px-4 bg-purple-600">Admins: {adminCount}</Badge>
          </div>
        </div>

        <div className="grid gap-4">
          {usersWithStats.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {user.full_name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {user.isActive && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{user.full_name || "Unknown User"}</CardTitle>
                      {user.isActive && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email || "No email"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                      {user.lastSignIn && (
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          Last active {new Date(user.lastSignIn).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                      {user.role}
                    </Badge>
                    <Badge variant="outline">{user.examCount} exams</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
