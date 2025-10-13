"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Question = {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

type Props = {
  questions: Question[]
  sessionId: string
  subjectName: string
  userId: string
}

type Answer = {
  questionId: string
  selectedAnswer: string | null
}

export function ExamInterface({ questions, sessionId, subjectName, userId }: Props) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(questions.map((q) => ({ questionId: q.id, selectedAnswer: null })))
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestionIndex]

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      selectedAnswer: value,
    }
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      // Calculate score
      let correctCount = 0
      const answerInserts = answers.map((answer, index) => {
        const question = questions[index]
        const isCorrect = answer.selectedAnswer === question.correct_answer

        if (isCorrect) correctCount++

        return {
          exam_session_id: sessionId,
          question_id: answer.questionId,
          selected_answer: answer.selectedAnswer,
          is_correct: isCorrect,
        }
      })

      // Insert all answers
      await supabase.from("exam_answers").insert(answerInserts)

      // Update exam session with score
      await supabase
        .from("exam_sessions")
        .update({
          completed_at: new Date().toISOString(),
          score: correctCount,
        })
        .eq("id", sessionId)

      // Redirect to results
      router.push(`/student/results/${sessionId}`)
    } catch (error) {
      console.error("[v0] Error submitting exam:", error)
      alert("Failed to submit exam. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const answeredCount = answers.filter((a) => a.selectedAnswer !== null).length
  const unansweredCount = questions.length - answeredCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-blue-900">{subjectName}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-mono font-semibold text-blue-900">{formatTime(timeRemaining)}</span>
              </div>
              <Button onClick={() => setShowSubmitDialog(true)} variant="destructive" disabled={isSubmitting}>
                <Flag className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base leading-relaxed">{currentQuestion.question_text}</p>

                <RadioGroup value={currentAnswer.selectedAnswer || ""} onValueChange={handleAnswerChange}>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer">
                      <RadioGroupItem value="A" id="option-a" className="mt-1" />
                      <Label htmlFor="option-a" className="flex-1 cursor-pointer font-normal">
                        <span className="font-semibold mr-2">A.</span>
                        {currentQuestion.option_a}
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer">
                      <RadioGroupItem value="B" id="option-b" className="mt-1" />
                      <Label htmlFor="option-b" className="flex-1 cursor-pointer font-normal">
                        <span className="font-semibold mr-2">B.</span>
                        {currentQuestion.option_b}
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer">
                      <RadioGroupItem value="C" id="option-c" className="mt-1" />
                      <Label htmlFor="option-c" className="flex-1 cursor-pointer font-normal">
                        <span className="font-semibold mr-2">C.</span>
                        {currentQuestion.option_c}
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer">
                      <RadioGroupItem value="D" id="option-d" className="mt-1" />
                      <Label htmlFor="option-d" className="flex-1 cursor-pointer font-normal">
                        <span className="font-semibold mr-2">D.</span>
                        {currentQuestion.option_d}
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Question Navigator</CardTitle>
                <div className="flex gap-2 text-sm">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {answeredCount} Answered
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {unansweredCount} Left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => {
                    const isAnswered = answers[index].selectedAnswer !== null
                    const isCurrent = index === currentQuestionIndex

                    return (
                      <button
                        key={index}
                        onClick={() => handleQuestionNavigation(index)}
                        className={`
                          aspect-square rounded-md text-sm font-medium transition-all
                          ${isCurrent ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                          ${
                            isAnswered
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {questions.length} questions.
              {unansweredCount > 0 && (
                <span className="block mt-2 text-orange-600 font-medium">
                  Warning: {unansweredCount} question(s) are still unanswered.
                </span>
              )}
              <span className="block mt-2">Are you sure you want to submit your exam?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitExam} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
