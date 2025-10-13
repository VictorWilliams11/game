import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Brain, Trophy, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4">CBT Practice App</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master JAMB, WAEC, and NECO exams with our comprehensive computer-based testing platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
              <Link href="/auth/login">Login</Link>
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
                <h3 className="font-semibold text-lg mb-2">Smart Practice</h3>
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
                <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">Monitor your performance and identify weak areas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Admin Panel</h3>
                <p className="text-sm text-muted-foreground">Easy question management for administrators</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exam Types Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-8">Supported Examinations</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">JAMB</h3>
                <p className="text-sm text-muted-foreground">Joint Admissions and Matriculation Board</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-purple-600 mb-2">WAEC</h3>
                <p className="text-sm text-muted-foreground">West African Examinations Council</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-green-600 mb-2">NECO</h3>
                <p className="text-sm text-muted-foreground">National Examinations Council</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
