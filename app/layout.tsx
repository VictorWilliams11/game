import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "CBT Practice - CampusGist",
  description: "Practice for Nigerian exams (JAMB, WAEC, NECO) with our comprehensive CBT platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col`}>
        <SiteHeader />
        <main className="flex-1">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
