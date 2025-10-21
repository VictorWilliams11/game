"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

export function StudentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("target_role", "student")
          .order("created_at", { ascending: false })
          .limit(5)

        setNotifications(data || [])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          if (payload.new.target_role === "student" || payload.new.target_role === "all") {
            setNotifications((prev) => [payload.new, ...prev].slice(0, 5))
          }
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  if (isLoading) return null

  if (notifications.length === 0) return null

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-3 bg-white rounded-lg border border-blue-200 flex items-start gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
                  <Badge className="text-xs bg-blue-600">{notification.notification_type}</Badge>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
