import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Trophy, Users, CheckCircle, Clock, BarChart, FileQuestion } from "lucide-react"
import Link from "next/link"
import { Leaderboard } from "@/components/leaderboard"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const { count: questionsCount } = await supabase.from("questions").select("*", { count: "exact", head: true })
  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")
  const { count: examsCount } = await supabase.from("exam_sessions").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-600 text-white px-4 py-2 text-sm">Powered by CampusGist.com.ng</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4">CBT Practice Platform</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master JAMB, WAEC, and NECO exams with CampusGist's comprehensive computer-based testing platform. Practice
            like the real exam!
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <FileQuestion className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-blue-900">{questionsCount || 1000}+</span>
              <span className="text-muted-foreground">Questions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-bold text-purple-900">{studentsCount || 500}+</span>
              <span className="text-muted-foreground">Students</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-green-600" />
              <span className="font-bold text-green-900">{examsCount || 2000}+</span>
              <span className="text-muted-foreground">Exams Taken</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/sign-up">Start Practicing Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
              <Link href="/auth/login">Login to Continue</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Multiple Exams</h3>
                <p className="text-sm text-muted-foreground">Practice for JAMB, WAEC, and NECO all in one place</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Real Exam Experience</h3>
                <p className="text-sm text-muted-foreground">Realistic exam simulation with timer and navigation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
                <p className="text-sm text-muted-foreground">Monitor performance and identify areas to improve</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Multiple Subjects</h3>
                <p className="text-sm text-muted-foreground">Select up to 4 subjects for JAMB, 9 for WAEC/NECO</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-3">Top Performers This Month</h2>
            <p className="text-muted-foreground">
              See how you rank against other students. Practice more to climb the leaderboard!
            </p>
          </div>
          <Leaderboard limit={5} />
        </div>

        <div className="mb-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-3">Why Choose CampusGist CBT?</h2>
            <p className="text-muted-foreground">
              Nigeria's trusted education platform brings you the best exam preparation tools
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Authentic Questions</h4>
                <p className="text-sm text-muted-foreground">
                  Practice with questions similar to actual JAMB, WAEC, and NECO exams
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Timed Practice</h4>
                <p className="text-sm text-muted-foreground">
                  Experience real exam conditions with countdown timers and time management
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <BarChart className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Detailed Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Review your answers and see explanations for every question
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Types Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-8">Supported Examinations</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">JAMB</h3>
                <p className="text-sm text-muted-foreground mb-3">Joint Admissions and Matriculation Board</p>
                <Badge variant="secondary">Select up to 4 subjects</Badge>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-purple-600 mb-2">WAEC</h3>
                <p className="text-sm text-muted-foreground mb-3">West African Examinations Council</p>
                <Badge variant="secondary">Select up to 9 subjects</Badge>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-green-600 mb-2">NECO</h3>
                <p className="text-sm text-muted-foreground mb-3">National Examinations Council</p>
                <Badge variant="secondary">Select up to 9 subjects</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Exams?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students using CampusGist to prepare for their exams
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link href="/auth/sign-up">Get Started Now - It's Free!</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
