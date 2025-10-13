import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function Leaderboard({ limit = 10 }: { limit?: number }) {
  const supabase = await createClient()

  // Get top students by average score
  const { data: topStudents } = await supabase.rpc("get_top_students", { limit_count: limit })

  // If RPC doesn't exist, fallback to manual query
  const { data: sessions } = await supabase
    .from("exam_sessions")
    .select("user_id, score, total_questions, profiles(full_name, email)")
    .not("score", "is", null)
    .order("score", { ascending: false })
    .limit(limit * 3)

  // Calculate average scores per user
  const userScores = new Map<string, { name: string; totalScore: number; count: number; avgScore: number }>()

  sessions?.forEach((session) => {
    const userId = session.user_id
    const percentage = session.total_questions > 0 ? (session.score! / session.total_questions) * 100 : 0
    const name = session.profiles?.full_name || session.profiles?.email || "Anonymous"

    if (userScores.has(userId)) {
      const existing = userScores.get(userId)!
      existing.totalScore += percentage
      existing.count += 1
      existing.avgScore = existing.totalScore / existing.count
    } else {
      userScores.set(userId, {
        name,
        totalScore: percentage,
        count: 1,
        avgScore: percentage,
      })
    }
  })

  // Sort by average score and take top N
  const topUsers = Array.from(userScores.values())
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, limit)

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                  {index + 1}
                </div>
                {getMedalIcon(index)}
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.count} exam(s) taken</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-blue-600">{user.avgScore.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          ))}

          {topUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No scores yet. Be the first to take an exam!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
