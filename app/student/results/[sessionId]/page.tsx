import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, Clock } from "lucide-react"

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
      exam_types (name),
      subjects (name)
    `)
    .eq("id", sessionId)
    .eq("user_id", data.user.id)
    .single()

  if (!session) {
    redirect("/student/results")
  }

  // Fetch exam answers with questions
  const { data: answers } = await supabase
    .from("exam_answers")
    .select(`
      *,
      questions (*)
    `)
    .eq("exam_session_id", sessionId)
    .order("answered_at")

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
                <CardTitle className="text-2xl mb-2">
                  {session.exam_types.name} - {session.subjects.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Completed on {new Date(session.completed_at).toLocaleString()}
                </p>
              </div>
              <Badge variant={isPassed ? "default" : "destructive"} className="text-lg px-4 py-2">
                {isPassed ? "Passed" : "Failed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
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
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Question Review</h2>
          <div className="space-y-4">
            {answers?.map((answer: any, index: number) => {
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
                      <div
                        className={`p-3 rounded-lg border-2 ${
                          answer.selected_answer === "A"
                            ? isCorrect
                              ? "bg-green-50 border-green-300"
                              : "bg-red-50 border-red-300"
                            : question.correct_answer === "A"
                              ? "bg-green-50 border-green-300"
                              : "bg-muted border-transparent"
                        }`}
                      >
                        <span className="font-semibold">A.</span> {question.option_a}
                        {question.correct_answer === "A" && <Badge className="ml-2 bg-green-500">Correct Answer</Badge>}
                        {answer.selected_answer === "A" && !isCorrect && (
                          <Badge variant="destructive" className="ml-2">
                            Your Answer
                          </Badge>
                        )}
                      </div>

                      <div
                        className={`p-3 rounded-lg border-2 ${
                          answer.selected_answer === "B"
                            ? isCorrect
                              ? "bg-green-50 border-green-300"
                              : "bg-red-50 border-red-300"
                            : question.correct_answer === "B"
                              ? "bg-green-50 border-green-300"
                              : "bg-muted border-transparent"
                        }`}
                      >
                        <span className="font-semibold">B.</span> {question.option_b}
                        {question.correct_answer === "B" && <Badge className="ml-2 bg-green-500">Correct Answer</Badge>}
                        {answer.selected_answer === "B" && !isCorrect && (
                          <Badge variant="destructive" className="ml-2">
                            Your Answer
                          </Badge>
                        )}
                      </div>

                      <div
                        className={`p-3 rounded-lg border-2 ${
                          answer.selected_answer === "C"
                            ? isCorrect
                              ? "bg-green-50 border-green-300"
                              : "bg-red-50 border-red-300"
                            : question.correct_answer === "C"
                              ? "bg-green-50 border-green-300"
                              : "bg-muted border-transparent"
                        }`}
                      >
                        <span className="font-semibold">C.</span> {question.option_c}
                        {question.correct_answer === "C" && <Badge className="ml-2 bg-green-500">Correct Answer</Badge>}
                        {answer.selected_answer === "C" && !isCorrect && (
                          <Badge variant="destructive" className="ml-2">
                            Your Answer
                          </Badge>
                        )}
                      </div>

                      <div
                        className={`p-3 rounded-lg border-2 ${
                          answer.selected_answer === "D"
                            ? isCorrect
                              ? "bg-green-50 border-green-300"
                              : "bg-red-50 border-red-300"
                            : question.correct_answer === "D"
                              ? "bg-green-50 border-green-300"
                              : "bg-muted border-transparent"
                        }`}
                      >
                        <span className="font-semibold">D.</span> {question.option_d}
                        {question.correct_answer === "D" && <Badge className="ml-2 bg-green-500">Correct Answer</Badge>}
                        {answer.selected_answer === "D" && !isCorrect && (
                          <Badge variant="destructive" className="ml-2">
                            Your Answer
                          </Badge>
                        )}
                      </div>
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href="/student/select-exam">Take Another Exam</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
