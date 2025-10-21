"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SendNotificationPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [notificationType, setNotificationType] = useState("general")
  const [targetRole, setTargetRole] = useState("student")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("notifications").insert({
        admin_id: user.id,
        title,
        message,
        notification_type: notificationType,
        target_role: targetRole,
      })

      if (error) throw error
      router.push("/admin-secure-portal/notifications")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin-secure-portal/notifications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notifications
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Send Notification
            </CardTitle>
            <CardDescription>Send a notification to students or admins</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Notification title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Notification message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Notification Type</Label>
                    <Select value={notificationType} onValueChange={setNotificationType}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="target">Send To</Label>
                    <Select value={targetRole} onValueChange={setTargetRole}>
                      <SelectTrigger id="target">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Students</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
