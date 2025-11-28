import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import "./globals.css"

export const metadata: Metadata = {
  title: "CampusGist CBT - Nigerian Exam Practice Platform (JAMB, WAEC, NECO)",
  description:
    "Master Nigerian entrance exams with CampusGist CBT. Practice 2000+ questions, access study materials, and track your progress. Ideal for JAMB, WAEC, and NECO exam preparation.",
  keywords:
    "CBT practice, JAMB exam, WAEC exam, NECO exam, Nigerian exams, online exam practice, entrance exam preparation",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "86IUZxDHnbYnlYnhdkeeWUZv5FLYkFBE5d_JySx8SCc",
  },
  openGraph: {
    title: "CampusGist CBT - Nigerian Exam Practice Platform",
    description: "Master Nigerian entrance exams with 2000+ practice questions and comprehensive study materials",
    url: "https://cbt.campusgist.com.ng",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col`}>
        <SiteHeader />
        <main className="flex-1">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Analytics />
      </body>
    </html>
  )
}
