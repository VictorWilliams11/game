"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"

type ExamType = {
  id: string
  name: string
  description: string | null
}

type Props = {
  examTypes: ExamType[]
}

export function ExamTypeSelector({ examTypes }: Props) {
  const router = useRouter()

  const handleSelectExam = (examType: ExamType) => {
    router.push(`/student/select-subject?examTypeId=${examType.id}&examTypeName=${examType.name}`)
  }

  const getExamColor = (name: string) => {
    switch (name) {
      case "JAMB":
        return "border-blue-300 hover:border-blue-500 hover:shadow-blue-200"
      case "WAEC":
        return "border-purple-300 hover:border-purple-500 hover:shadow-purple-200"
      case "NECO":
        return "border-green-300 hover:border-green-500 hover:shadow-green-200"
      default:
        return "border-gray-300 hover:border-gray-500"
    }
  }

  const getExamBadgeColor = (name: string) => {
    switch (name) {
      case "JAMB":
        return "bg-blue-100 text-blue-700"
      case "WAEC":
        return "bg-purple-100 text-purple-700"
      case "NECO":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (examTypes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No exam types available at the moment.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {examTypes.map((examType) => (
        <Card
          key={examType.id}
          className={`border-2 transition-all hover:shadow-lg cursor-pointer ${getExamColor(examType.name)}`}
          onClick={() => handleSelectExam(examType)}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{examType.name}</CardTitle>
            <CardDescription className="min-h-12">{examType.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-transparent" variant="outline">
              Select {examType.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
