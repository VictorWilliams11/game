import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Bell, Trash2, ArrowLeft } from "lucide-react"

export default async function AdminNotificationsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("admin_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button asChild variant="ghost" className="mb-4 text-white hover:bg-slate-700">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Notifications</h1>
            <p className="text-slate-300">Send notifications to students and admins</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin-secure-portal/notifications/send">
              <Plus className="h-4 w-4 mr-2" />
              Send Notification
            </Link>
          </Button>
        </div>

        {notifications && notifications.length > 0 ? (
          <div className="grid gap-4">
            {notifications.map((notification: any) => (
              <Card key={notification.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Bell className="h-5 w-5 text-blue-400" />
                        {notification.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-2">{notification.message}</CardDescription>
                    </div>
                    <form
                      action={async () => {
                        "use server"
                        const supabase = await createClient()
                        await supabase.from("notifications").delete().eq("id", notification.id)
                        redirect("/admin-secure-portal/notifications")
                      }}
                    >
                      <Button type="submit" variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Badge className="bg-blue-600">{notification.notification_type}</Badge>
                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                      {notification.target_role === "all" ? "All Users" : notification.target_role}
                    </Badge>
                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No notifications sent yet</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin-secure-portal/notifications/send">
                  <Plus className="h-4 w-4 mr-2" />
                  Send First Notification
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
