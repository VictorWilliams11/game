"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

type SubjectWithQuestions = {
  id: string
  name: string
  questions: Question[]
}

type Props = {
  subjectsWithQuestions: SubjectWithQuestions[]
  sessionId: string
  userId: string
}

type Answer = {
  questionId: string
  selectedAnswer: string | null
}

export function ExamInterface({ subjectsWithQuestions, sessionId, userId }: Props) {
  const router = useRouter()
  const [activeSubjectId, setActiveSubjectId] = useState(subjectsWithQuestions[0]?.id || "")
  const [currentQuestionIndexBySubject, setCurrentQuestionIndexBySubject] = useState<Record<string, number>>(
    Object.fromEntries(subjectsWithQuestions.map((s) => [s.id, 0])),
  )
  const allQuestions = subjectsWithQuestions.flatMap((s) => s.questions)
  const [answers, setAnswers] = useState<Answer[]>(
    allQuestions.map((q) => ({ questionId: q.id, selectedAnswer: null })),
  )
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  const activeSubject = subjectsWithQuestions.find((s) => s.id === activeSubjectId)!
  const currentQuestionIndex = currentQuestionIndexBySubject[activeSubjectId] || 0
  const currentQuestion = activeSubject.questions[currentQuestionIndex]
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)

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
    const answerIndex = answers.findIndex((a) => a.questionId === currentQuestion.id)
    if (answerIndex !== -1) {
      const newAnswers = [...answers]
      newAnswers[answerIndex] = {
        ...newAnswers[answerIndex],
        selectedAnswer: value,
      }
      setAnswers(newAnswers)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < activeSubject.questions.length - 1) {
      setCurrentQuestionIndexBySubject({
        ...currentQuestionIndexBySubject,
        [activeSubjectId]: currentQuestionIndex + 1,
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndexBySubject({
        ...currentQuestionIndexBySubject,
        [activeSubjectId]: currentQuestionIndex - 1,
      })
    }
  }

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndexBySubject({
      ...currentQuestionIndexBySubject,
      [activeSubjectId]: index,
    })
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      let correctCount = 0
      const answerInserts = answers.map((answer) => {
        const question = allQuestions.find((q) => q.id === answer.questionId)!
        const isCorrect = answer.selectedAnswer === question.correct_answer

        if (isCorrect) correctCount++

        return {
          exam_session_id: sessionId,
          question_id: answer.questionId,
          selected_answer: answer.selectedAnswer,
          is_correct: isCorrect,
        }
      })

      await supabase.from("exam_answers").insert(answerInserts)

      await supabase
        .from("exam_sessions")
        .update({
          completed_at: new Date().toISOString(),
          score: correctCount,
        })
        .eq("id", sessionId)

      router.push(`/student/results/${sessionId}`)
    } catch (error) {
      console.error("[v0] Error submitting exam:", error)
      alert("Failed to submit exam. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const answeredCount = answers.filter((a) => a.selectedAnswer !== null).length
  const unansweredCount = allQuestions.length - answeredCount

  const getSubjectAnsweredCount = (subjectId: string) => {
    const subject = subjectsWithQuestions.find((s) => s.id === subjectId)!
    const subjectQuestionIds = subject.questions.map((q) => q.id)
    return answers.filter((a) => subjectQuestionIds.includes(a.questionId) && a.selectedAnswer !== null).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-blue-900">CBT Examination</h1>
              <p className="text-sm text-muted-foreground">
                {subjectsWithQuestions.length} Subject{subjectsWithQuestions.length > 1 ? "s" : ""} •{" "}
                {allQuestions.length} Total Questions
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
        <Tabs value={activeSubjectId} onValueChange={setActiveSubjectId} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto bg-white p-2 gap-2">
            {subjectsWithQuestions.map((subject) => (
              <TabsTrigger
                key={subject.id}
                value={subject.id}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2"
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{subject.name}</span>
                  <span className="text-xs opacity-80">
                    {getSubjectAnsweredCount(subject.id)}/{subject.questions.length}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {subjectsWithQuestions.map((subject) => (
            <TabsContent key={subject.id} value={subject.id} className="mt-0">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Main Question Area */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {subject.name} - Question {currentQuestionIndexBySubject[subject.id] + 1}
                        </CardTitle>
                        <Badge variant="outline">
                          {currentQuestionIndexBySubject[subject.id] + 1} of {subject.questions.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {currentQuestion && (
                        <>
                          <p className="text-base leading-relaxed">{currentQuestion.question_text}</p>

                          <RadioGroup value={currentAnswer?.selectedAnswer || ""} onValueChange={handleAnswerChange}>
                            <div className="space-y-3">
                              {["A", "B", "C", "D"].map((option) => (
                                <div
                                  key={option}
                                  className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer"
                                >
                                  <RadioGroupItem
                                    value={option}
                                    id={`option-${option.toLowerCase()}`}
                                    className="mt-1"
                                  />
                                  <Label
                                    htmlFor={`option-${option.toLowerCase()}`}
                                    className="flex-1 cursor-pointer font-normal"
                                  >
                                    <span className="font-semibold mr-2">{option}.</span>
                                    {currentQuestion[`option_${option.toLowerCase()}` as keyof Question]}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>

                          {/* Navigation Buttons */}
                          <div className="flex justify-between pt-4">
                            <Button
                              onClick={handlePrevious}
                              disabled={currentQuestionIndexBySubject[subject.id] === 0}
                              variant="outline"
                            >
                              <ChevronLeft className="h-4 w-4 mr-2" />
                              Previous
                            </Button>
                            <Button
                              onClick={handleNext}
                              disabled={currentQuestionIndexBySubject[subject.id] === subject.questions.length - 1}
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Question Navigator Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-base">{subject.name}</CardTitle>
                      <div className="flex gap-2 text-sm">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {getSubjectAnsweredCount(subject.id)} Done
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {subject.questions.length - getSubjectAnsweredCount(subject.id)} Left
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-2">
                        {subject.questions.map((question, index) => {
                          const answer = answers.find((a) => a.questionId === question.id)
                          const isAnswered = answer?.selectedAnswer !== null
                          const isCurrent = index === currentQuestionIndexBySubject[subject.id]

                          return (
                            <button
                              key={question.id}
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
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {allQuestions.length} questions across all subjects.
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
