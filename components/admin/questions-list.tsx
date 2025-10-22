"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Question = {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation: string | null
  subjects: {
    name: string
    exam_types: { name: string }
  }
}

type Props = {
  questions: Question[]
}

export function QuestionsList({ questions }: Props) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    setDeletingId(id)
    setError(null)
    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("questions").delete().eq("id", id)

      if (deleteError) {
        console.error("[v0] Delete error:", deleteError)
        throw new Error(deleteError.message || "Failed to delete question")
      }

      console.log("[v0] Question deleted successfully:", id)
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete question"
      console.error("[v0] Delete failed:", errorMessage)
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setDeletingId(null)
    }
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No questions added yet. Start by adding your first question.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{question.question_text}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{question.subjects.exam_types.name}</Badge>
                  <Badge variant="outline">{question.subjects.name}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(question.id)}
                disabled={deletingId === question.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div
                  className={`p-2 rounded ${question.correct_answer === "A" ? "bg-green-50 border border-green-200" : "bg-muted"}`}
                >
                  <span className="font-semibold">A:</span> {question.option_a}
                </div>
                <div
                  className={`p-2 rounded ${question.correct_answer === "B" ? "bg-green-50 border border-green-200" : "bg-muted"}`}
                >
                  <span className="font-semibold">B:</span> {question.option_b}
                </div>
                <div
                  className={`p-2 rounded ${question.correct_answer === "C" ? "bg-green-50 border border-green-200" : "bg-muted"}`}
                >
                  <span className="font-semibold">C:</span> {question.option_c}
                </div>
                <div
                  className={`p-2 rounded ${question.correct_answer === "D" ? "bg-green-50 border border-green-200" : "bg-muted"}`}
                >
                  <span className="font-semibold">D:</span> {question.option_d}
                </div>
              </div>
              {question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm">
                    <span className="font-semibold">Explanation:</span> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
