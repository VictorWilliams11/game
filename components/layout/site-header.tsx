"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    checkUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Campus Gist CBT" width={40} height={40} className="h-10 w-10 rounded-lg" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 leading-none">Campus Gist</span>
            <span className="text-xs text-blue-600 leading-none">CBT Practice</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/#about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            About CBT
          </Link>
          <Link href="/#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link
            href="/#leaderboard"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="https://campusgist.com.ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Back to CampusGist.com.ng
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3"></div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About CBT
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#leaderboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              href="https://campusgist.com.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Back to CampusGist.com.ng
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
