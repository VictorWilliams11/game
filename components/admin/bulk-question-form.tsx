"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, Upload } from "lucide-react"

type ExamType = {
  id: string
  name: string
}

type Subject = {
  id: string
  name: string
  exam_type_id: string
  exam_types: { name: string }
}

type Question = {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string
}

type Props = {
  examTypes: ExamType[]
  subjects: Subject[]
}

export function BulkQuestionForm({ examTypes, subjects }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedExamType, setSelectedExamType] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
    },
  ])

  const filteredSubjects = subjects.filter((subject) => subject.exam_type_id === selectedExamType)

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        explanation: "",
      },
    ])
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: string, field: keyof Question, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!selectedExamType || !selectedSubject) {
      setError("Please select exam type and subject")
      setIsLoading(false)
      return
    }

    // Validate all questions
    const invalidQuestions = questions.filter(
      (q) => !q.questionText || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctAnswer,
    )

    if (invalidQuestions.length > 0) {
      setError(`Please fill in all required fields for all questions`)
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { data: userData } = await supabase.auth.getUser()

      const questionsToInsert = questions.map((q) => ({
        subject_id: selectedSubject,
        question_text: q.questionText,
        option_a: q.optionA,
        option_b: q.optionB,
        option_c: q.optionC,
        option_d: q.optionD,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || null,
        created_by: userData?.user?.id,
      }))

      const { error } = await supabase.from("questions").insert(questionsToInsert)

      if (error) throw error

      router.push("/admin-secure-portal/questions")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add questions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam & Subject Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="examType">Exam Type</Label>
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger id="examType">
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedExamType}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Question Text</Label>
                <Textarea
                  placeholder="Enter the question text"
                  value={question.questionText}
                  onChange={(e) => updateQuestion(question.id, "questionText", e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Option A</Label>
                  <Input
                    value={question.optionA}
                    onChange={(e) => updateQuestion(question.id, "optionA", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Option B</Label>
                  <Input
                    value={question.optionB}
                    onChange={(e) => updateQuestion(question.id, "optionB", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Option C</Label>
                  <Input
                    value={question.optionC}
                    onChange={(e) => updateQuestion(question.id, "optionC", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Option D</Label>
                  <Input
                    value={question.optionD}
                    onChange={(e) => updateQuestion(question.id, "optionD", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={question.correctAnswer}
                  onValueChange={(value) => updateQuestion(question.id, "correctAnswer", value)}
                  required
                >
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id={`${question.id}-A`} />
                      <Label htmlFor={`${question.id}-A`} className="font-normal cursor-pointer">
                        Option A
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id={`${question.id}-B`} />
                      <Label htmlFor={`${question.id}-B`} className="font-normal cursor-pointer">
                        Option B
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id={`${question.id}-C`} />
                      <Label htmlFor={`${question.id}-C`} className="font-normal cursor-pointer">
                        Option C
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id={`${question.id}-D`} />
                      <Label htmlFor={`${question.id}-D`} className="font-normal cursor-pointer">
                        Option D
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label>Explanation (Optional)</Label>
                <Textarea
                  placeholder="Provide an explanation for the correct answer"
                  value={question.explanation}
                  onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={addQuestion} className="flex-1 bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Question
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? `Uploading ${questions.length} Questions...` : `Upload ${questions.length} Questions`}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
