"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to main CampusGist search
    if (searchQuery.trim()) {
      window.open(`https://campusgist.com.ng/?s=${encodeURIComponent(searchQuery)}`, "_blank")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="https://campusgist.com.ng/" className="flex items-center">
          <h1 className="text-xl font-bold text-black underline decoration-2 underline-offset-4">Campus Gist</h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="https://campusgist.com.ng/"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            href="https://campusgist.com.ng/pages"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Pages
          </Link>
          <Link
            href="https://campusgist.com.ng/about-us"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            About Us
          </Link>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            CBT Practice
          </Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search CampusGist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 h-9 text-sm"
          />
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 h-9">
            Search
          </Button>
        </form>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => {
            const nav = document.getElementById("mobile-nav")
            nav?.classList.toggle("hidden")
          }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div id="mobile-nav" className="hidden md:hidden border-t bg-white">
        <nav className="container mx-auto flex flex-col gap-4 p-4">
          <Link href="https://campusgist.com.ng/" className="text-sm font-medium text-gray-700">
            Home
          </Link>
          <Link href="https://campusgist.com.ng/pages" className="text-sm font-medium text-gray-700">
            Pages
          </Link>
          <Link href="https://campusgist.com.ng/about-us" className="text-sm font-medium text-gray-700">
            About Us
          </Link>
          <Link href="/" className="text-sm font-medium text-blue-600">
            CBT Practice
          </Link>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search CampusGist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-9 text-sm"
            />
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 h-9">
              Search
            </Button>
          </form>
        </nav>
      </div>
    </header>
  )
}
