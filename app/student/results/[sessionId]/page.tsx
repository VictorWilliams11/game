"use client"

import React from "react"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, Clock, BookOpen } from "lucide-react"
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
import { RotateCcw } from "lucide-react"

export default async function ResultDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const supabase = await createClient()
  const { sessionId } = await params

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch exam session
  const { data: session } = await supabase
    .from("exam_sessions")
    .select(`
      *,
      exam_types (name)
    `)
    .eq("id", sessionId)
    .eq("user_id", data.user.id)
    .single()

  if (!session) {
    redirect("/student/results")
  }

  const { data: sessionSubjects } = await supabase
    .from("exam_session_subjects")
    .select(`
      *,
      subjects (id, name)
    `)
    .eq("exam_session_id", sessionId)

  const { data: answers } = await supabase
    .from("exam_answers")
    .select(`
      *,
      questions (*, subjects (id, name))
    `)
    .eq("exam_session_id", sessionId)
    .order("answered_at")

  const answersBySubject = answers?.reduce(
    (acc: any, answer: any) => {
      const subjectId = answer.questions.subjects.id
      const subjectName = answer.questions.subjects.name
      if (!acc[subjectId]) {
        acc[subjectId] = {
          id: subjectId,
          name: subjectName,
          answers: [],
          correct: 0,
          total: 0,
        }
      }
      acc[subjectId].answers.push(answer)
      acc[subjectId].total++
      if (answer.is_correct) acc[subjectId].correct++
      return acc
    },
    {} as Record<string, any>,
  )

  const subjectResults = Object.values(answersBySubject || {})
  const percentage = Math.round((session.score / session.total_questions) * 100)
  const isPassed = percentage >= 50

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/student/results">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Link>
        </Button>

        {/* Results Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">{session.exam_types.name} Exam</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Completed on {new Date(session.completed_at).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sessionSubjects?.map((ss: any) => (
                    <Badge key={ss.id} variant="outline">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {ss.subjects.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge variant={isPassed ? "default" : "destructive"} className="text-lg px-4 py-2">
                {isPassed ? "Passed" : "Failed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {session.score}/{session.total_questions}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="text-2xl font-bold text-purple-900">{percentage}%</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold text-green-900">{session.duration_minutes} min</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Performance by Subject</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {subjectResults.map((subject: any) => {
                  const subjectPercentage = Math.round((subject.correct / subject.total) * 100)
                  return (
                    <div key={subject.id} className="p-4 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{subject.name}</p>
                        <Badge variant={subjectPercentage >= 50 ? "default" : "destructive"}>
                          {subjectPercentage}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {subject.correct} / {subject.total} correct
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Question Review</h2>
          <Tabs defaultValue={subjectResults[0]?.id} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
              {subjectResults.map((subject: any) => (
                <TabsTrigger key={subject.id} value={subject.id} className="flex-shrink-0">
                  {subject.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {subjectResults.map((subject: any) => (
              <TabsContent key={subject.id} value={subject.id} className="space-y-4 mt-4">
                {subject.answers.map((answer: any, index: number) => {
                  const question = answer.questions
                  const isCorrect = answer.is_correct

                  return (
                    <Card key={answer.id} className={`border-2 ${isCorrect ? "border-green-200" : "border-red-200"}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          {isCorrect ? (
                            <Badge className="bg-green-500">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Correct
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Incorrect
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-base leading-relaxed">{question.question_text}</p>

                        <div className="space-y-2">
                          {["A", "B", "C", "D"].map((option) => {
                            const optionText = question[`option_${option.toLowerCase()}`]
                            const isSelected = answer.selected_answer === option
                            const isCorrectAnswer = question.correct_answer === option

                            return (
                              <div
                                key={option}
                                className={`p-3 rounded-lg border-2 ${
                                  isSelected
                                    ? isCorrect
                                      ? "bg-green-50 border-green-300"
                                      : "bg-red-50 border-red-300"
                                    : isCorrectAnswer
                                      ? "bg-green-50 border-green-300"
                                      : "bg-muted border-transparent"
                                }`}
                              >
                                <span className="font-semibold">{option}.</span> {optionText}
                                {isCorrectAnswer && <Badge className="ml-2 bg-green-500">Correct Answer</Badge>}
                                {isSelected && !isCorrect && (
                                  <Badge variant="destructive" className="ml-2">
                                    Your Answer
                                  </Badge>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {question.explanation && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                            <p className="text-sm text-blue-800">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href="/student/select-exam">Take Another Exam</Link>
          </Button>
          <ResetResultButton sessionId={sessionId} />
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ResetResultButton({ sessionId }: { sessionId: string }) {
  const [isResetting, setIsResetting] = React.useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const response = await fetch(`/api/results/${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        window.location.href = "/student/results"
      } else {
        alert("Failed to reset result")
      }
    } catch (error) {
      console.error("Error resetting result:", error)
      alert("Error resetting result")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex-1 bg-transparent">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Result
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset This Result</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reset this exam result? This will delete all your answers and scores for this exam.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} disabled={isResetting} className="bg-red-600 hover:bg-red-700">
            {isResetting ? "Resetting..." : "Reset"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
