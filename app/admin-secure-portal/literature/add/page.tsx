"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"

export default function AddLiteraturePage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [examTypes, setExamTypes] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedExamType, setSelectedExamType] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    content: "",
  })

  useEffect(() => {
    async function fetchData() {
      const { data: examTypesData } = await supabase.from("exam_types").select("*").order("name")
      setExamTypes(examTypesData || [])
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchSubjects() {
      if (selectedExamType) {
        const { data } = await supabase.from("subjects").select("*").eq("exam_type_id", selectedExamType).order("name")
        setSubjects(data || [])
      } else {
        setSubjects([])
      }
    }
    fetchSubjects()
  }, [selectedExamType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("literature").insert({
        title: formData.title,
        author: formData.author || null,
        description: formData.description || null,
        content: formData.content,
        exam_type_id: selectedExamType,
        subject_id: selectedSubject || null,
        created_by: userData.user.id,
      })

      if (insertError) throw insertError

      router.push("/admin-secure-portal/literature")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button asChild variant="ghost" className="mb-6 text-white hover:bg-slate-700">
          <Link href="/admin-secure-portal/literature">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Literature
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Literature</CardTitle>
            <CardDescription>Add novels and literature materials for students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Things Fall Apart"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g., Chinua Achebe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type *</Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedExamType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the literature"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full text of the literature..."
                  rows={15}
                  required
                  className="font-mono text-sm"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Adding..." : "Add Literature"}
                </Button>
                <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/admin-secure-portal/literature">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
