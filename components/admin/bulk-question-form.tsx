"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"

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

type ParsedQuestion = {
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
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedExamType, setSelectedExamType] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [textInput, setTextInput] = useState("")
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([])

  const filteredSubjects = subjects.filter((subject) => subject.exam_type_id === selectedExamType)

  const parseQuestions = (text: string): ParsedQuestion[] => {
    const questions: ParsedQuestion[] = []
    const questionBlocks = text.split(/\n\s*\n+/).filter((block) => block.trim())

    for (const block of questionBlocks) {
      const lines = block.split("\n").map((line) => line.trim())
      if (lines.length < 7) continue

      const questionText = lines[0]
      const optionA = lines[1]?.replace(/^A\.\s*/, "") || ""
      const optionB = lines[2]?.replace(/^B\.\s*/, "") || ""
      const optionC = lines[3]?.replace(/^C\.\s*/, "") || ""
      const optionD = lines[4]?.replace(/^D\.\s*/, "") || ""

      const answerLine = lines.find((line) => line.startsWith("Answer:"))
      const correctAnswer = answerLine?.replace(/^Answer:\s*/, "").trim() || ""

      const explanationLine = lines.findIndex((line) => line.startsWith("Explanation:"))
      const explanation = explanationLine !== -1 ? lines[explanationLine].replace(/^Explanation:\s*/, "").trim() : ""

      if (questionText && optionA && optionB && optionC && optionD && correctAnswer) {
        questions.push({
          questionText,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer: correctAnswer.toUpperCase(),
          explanation,
        })
      }
    }

    return questions
  }

  const handleParseClick = () => {
    setError(null)
    setSuccess(null)

    if (!textInput.trim()) {
      setError("Please paste questions in the text area")
      return
    }

    const parsed = parseQuestions(textInput)

    if (parsed.length === 0) {
      setError("No valid questions found. Please check the format and try again.")
      return
    }

    setParsedQuestions(parsed)
    setSuccess(`Successfully parsed ${parsed.length} question(s)`)
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

    if (parsedQuestions.length === 0) {
      setError("Please parse questions first")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { data: userData } = await supabase.auth.getUser()

      const questionsToInsert = parsedQuestions.map((q) => ({
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

      setSuccess(`Successfully uploaded ${parsedQuestions.length} questions!`)
      setTextInput("")
      setParsedQuestions([])

      setTimeout(() => {
        router.push("/admin-secure-portal/questions")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload questions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Questions</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Upload multiple questions at once. Format each question as:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm space-y-1 font-mono">
            <p>Question text?</p>
            <p>A. Option A</p>
            <p>B. Option B</p>
            <p>C. Option C</p>
            <p>D. Option D</p>
            <p>Answer: A</p>
            <p>Explanation: ...</p>
            <p className="text-muted-foreground mt-2">(Leave a blank line between questions)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Selection</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="questions">Paste your questions here...</Label>
            <Textarea
              id="questions"
              placeholder="Question 1?
A. Option A
B. Option B
C. Option C
D. Option D
Answer: A
Explanation: This is the explanation

Question 2?
A. Option A
B. Option B
C. Option C
D. Option D
Answer: B
Explanation: This is the explanation"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {parsedQuestions.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">{parsedQuestions.length} questions ready to upload</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleParseClick}
          disabled={isLoading || !textInput.trim()}
          className="flex-1 bg-transparent"
        >
          Parse Questions
        </Button>
        <Button
          type="submit"
          disabled={isLoading || parsedQuestions.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? "Uploading..." : `Upload ${parsedQuestions.length} Questions`}
        </Button>
      </div>
    </form>
  )
}
