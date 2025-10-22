"use client"

import React from "react"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Trophy } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

export default async function ResultsListPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch all exam sessions for the user
  const { data: sessions } = await supabase
    .from("exam_sessions")
    .select(`
      *,
      exam_types (name),
      subjects (name)
    `)
    .eq("user_id", data.user.id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })

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
          <h1 className="text-3xl font-bold text-blue-900">My Results</h1>
          <p className="text-muted-foreground">View your past exam results and performance</p>
        </div>

        {!sessions || sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No exam results yet. Start practicing to see your results here.
              </p>
              <Button asChild>
                <Link href="/student/select-exam">Start Practice</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: any) => {
              const percentage = Math.round((session.score / session.total_questions) * 100)
              const isPassed = percentage >= 50

              return (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {session.exam_types.name} - {session.subjects.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.completed_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(session.completed_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-900">
                            {session.score}/{session.total_questions}
                          </div>
                          <Badge variant={isPassed ? "default" : "destructive"} className="mt-1">
                            {percentage}%
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild>
                            <Link href={`/student/results/${session.id}`}>View Details</Link>
                          </Button>
                          <DeleteResultButton sessionId={session.id} />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function DeleteResultButton({ sessionId }: { sessionId: string }) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/results/${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert("Failed to delete result")
      }
    } catch (error) {
      console.error("Error deleting result:", error)
      alert("Error deleting result")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Result</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this exam result? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
