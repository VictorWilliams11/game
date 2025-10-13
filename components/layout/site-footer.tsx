import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© 2025 CampusGist. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="https://campusgist.com.ng/privacy-policy"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="https://campusgist.com.ng/terms"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="https://campusgist.com.ng/contact"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
