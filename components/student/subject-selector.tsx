"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { FileQuestion } from "lucide-react"

type Subject = {
  id: string
  name: string
  exam_type_id: string
  questionCount: number
}

type Props = {
  subjects: Subject[]
  examTypeId: string
}

export function SubjectSelector({ subjects, examTypeId }: Props) {
  const router = useRouter()

  const handleSelectSubject = (subject: Subject) => {
    if (subject.questionCount === 0) {
      alert("No questions available for this subject yet.")
      return
    }
    router.push(`/student/exam?examTypeId=${examTypeId}&subjectId=${subject.id}&subjectName=${subject.name}`)
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <Card
          key={subject.id}
          className={`border-2 transition-all hover:shadow-lg ${
            subject.questionCount > 0 ? "cursor-pointer hover:border-blue-400" : "opacity-60 cursor-not-allowed"
          }`}
          onClick={() => handleSelectSubject(subject)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{subject.name}</CardTitle>
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
          <CardContent>
            <Button
              className="w-full"
              variant={subject.questionCount > 0 ? "default" : "outline"}
              disabled={subject.questionCount === 0}
            >
              {subject.questionCount > 0 ? "Start Practice" : "Coming Soon"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
