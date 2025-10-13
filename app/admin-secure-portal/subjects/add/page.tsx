"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddSubjectOrExamPage() {
  const [type, setType] = useState<"exam" | "subject">("subject")
  const [name, setName] = useState("")
  const [examTypeId, setExamTypeId] = useState("")
  const [examTypes, setExamTypes] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Load exam types when component mounts or when switching to subject type
  useState(() => {
    const loadExamTypes = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("exam_types").select("id, name").order("name")
      if (data) setExamTypes(data)
    }
    loadExamTypes()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      if (type === "exam") {
        const { error } = await supabase.from("exam_types").insert({ name })
        if (error) throw error
      } else {
        if (!examTypeId) {
          throw new Error("Please select an exam type")
        }
        const { error } = await supabase.from("subjects").insert({
          name,
          exam_type_id: examTypeId,
        })
        if (error) throw error
      }

      setSuccess(true)
      setName("")
      setExamTypeId("")

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin-secure-portal/subjects")
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin-secure-portal/subjects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add Exam Type or Subject</CardTitle>
            <CardDescription>Create new exam types or add subjects to existing exams</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label>What would you like to add?</Label>
                <RadioGroup value={type} onValueChange={(value) => setType(value as "exam" | "subject")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exam" id="exam" />
                    <Label htmlFor="exam" className="font-normal cursor-pointer">
                      Exam Type (e.g., JAMB, WAEC, NECO)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="subject" id="subject" />
                    <Label htmlFor="subject" className="font-normal cursor-pointer">
                      Subject (e.g., Mathematics, English, Physics)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{type === "exam" ? "Exam Type Name" : "Subject Name"}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={type === "exam" ? "e.g., JAMB" : "e.g., Mathematics"}
                  required
                />
              </div>

              {type === "subject" && (
                <div className="space-y-2">
                  <Label htmlFor="examType">Select Exam Type</Label>
                  <select
                    id="examType"
                    value={examTypeId}
                    onChange={(e) => setExamTypeId(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Choose an exam type...</option>
                    {examTypes.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {type === "exam" ? "Exam type" : "Subject"} added successfully! Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Adding..." : `Add ${type === "exam" ? "Exam Type" : "Subject"}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
