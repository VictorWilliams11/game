"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { FileQuestion, CheckCircle2 } from "lucide-react"
import { useState } from "react"

type Subject = {
  id: string
  name: string
  exam_type_id: string
  questionCount: number
}

type Props = {
  subjects: Subject[]
  examTypeId: string
  examTypeName: string
  maxSubjects: number
}

export function SubjectSelector({ subjects, examTypeId, examTypeName, maxSubjects }: Props) {
  const router = useRouter()
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])

  const handleToggleSubject = (subject: Subject) => {
    if (subject.questionCount === 0) {
      alert("No questions available for this subject yet.")
      return
    }

    setSelectedSubjects((prev) => {
      const isSelected = prev.some((s) => s.id === subject.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== subject.id)
      } else {
        if (prev.length >= maxSubjects) {
          alert(`You can only select up to ${maxSubjects} subjects for ${examTypeName}`)
          return prev
        }
        return [...prev, subject]
      }
    })
  }

  const handleStartExam = () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject")
      return
    }

    const subjectIds = selectedSubjects.map((s) => s.id).join(",")
    const subjectNames = selectedSubjects.map((s) => s.name).join(", ")
    router.push(
      `/student/exam?examTypeId=${examTypeId}&subjectIds=${subjectIds}&subjectNames=${encodeURIComponent(subjectNames)}`,
    )
  }

  if (subjects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No subjects available for this exam type.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Subjects</p>
              <p className="text-2xl font-bold text-blue-900">
                {selectedSubjects.length} / {maxSubjects}
              </p>
            </div>
            <Button onClick={handleStartExam} disabled={selectedSubjects.length === 0} size="lg">
              Start Exam
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.some((s) => s.id === subject.id)
          return (
            <Card
              key={subject.id}
              className={`border-2 transition-all hover:shadow-lg ${
                subject.questionCount > 0 ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
              } ${isSelected ? "border-blue-500 bg-blue-50" : "hover:border-blue-400"}`}
              onClick={() => handleToggleSubject(subject)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      {subject.name}
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileQuestion className="h-4 w-4" />
                      <span>{subject.questionCount} questions</span>
                    </div>
                  </div>
                  {subject.questionCount > 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-500">
                      No questions
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
