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

type Props = {
  examTypes: ExamType[]
  subjects: Subject[]
}

export function AddQuestionForm({ examTypes, subjects }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedExamType, setSelectedExamType] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [optionA, setOptionA] = useState("")
  const [optionB, setOptionB] = useState("")
  const [optionC, setOptionC] = useState("")
  const [optionD, setOptionD] = useState("")
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [explanation, setExplanation] = useState("")

  const filteredSubjects = subjects.filter((subject) => subject.exam_type_id === selectedExamType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data: userData } = await supabase.auth.getUser()

      const { error } = await supabase.from("questions").insert({
        subject_id: selectedSubject,
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
        explanation: explanation || null,
        created_by: userData?.user?.id,
      })

      if (error) throw error

      router.push("/admin-secure-portal/questions")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add question")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
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

            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter the question text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="optionA">Option A</Label>
                <Input id="optionA" value={optionA} onChange={(e) => setOptionA(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="optionB">Option B</Label>
                <Input id="optionB" value={optionB} onChange={(e) => setOptionB(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="optionC">Option C</Label>
                <Input id="optionC" value={optionC} onChange={(e) => setOptionC(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="optionD">Option D</Label>
                <Input id="optionD" value={optionD} onChange={(e) => setOptionD(e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Correct Answer</Label>
              <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer} required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id="answerA" />
                  <Label htmlFor="answerA" className="font-normal cursor-pointer">
                    Option A
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id="answerB" />
                  <Label htmlFor="answerB" className="font-normal cursor-pointer">
                    Option B
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id="answerC" />
                  <Label htmlFor="answerC" className="font-normal cursor-pointer">
                    Option C
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="D" id="answerD" />
                  <Label htmlFor="answerD" className="font-normal cursor-pointer">
                    Option D
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                placeholder="Provide an explanation for the correct answer"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding Question..." : "Add Question"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
