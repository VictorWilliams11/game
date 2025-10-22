"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ResetResultButton({ sessionId }: { sessionId: string }) {
  const [isResetting, setIsResetting] = React.useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const response = await fetch(`/api/results/${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        window.location.href = "/student/results"
      } else {
        alert("Failed to reset result")
      }
    } catch (error) {
      console.error("Error resetting result:", error)
      alert("Error resetting result")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex-1 bg-transparent">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Result
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset This Result</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reset this exam result? This will delete all your answers and scores for this exam.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} disabled={isResetting} className="bg-red-600 hover:bg-red-700">
            {isResetting ? "Resetting..." : "Reset"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
