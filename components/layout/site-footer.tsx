import Link from "next/link"
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 leading-none">Campus Gist CBT</span>
                <span className="text-xs text-blue-600 leading-none">Practice Platform</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              Nigeria's leading CBT practice platform for JAMB, WAEC, and NECO examinations. Powered by
              CampusGist.com.ng to help students achieve their academic goals.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://facebook.com/campusgist"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="https://twitter.com/campusgist"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Twitter className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="https://instagram.com/campusgist"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-pink-600 flex items-center justify-center hover:bg-pink-700 transition-colors"
              >
                <Instagram className="h-4 w-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  About CBT
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="https://campusgist.com.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  CampusGist.com.ng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:support@campusgist.com.ng"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  support@campusgist.com.ng
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <a href="tel:+2348115275575" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  +234 811 527 5575
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">© 2025 CampusGist. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="https://campusgist.com.ng/privacy-policy"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="https://campusgist.com.ng/terms"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="https://campusgist.com.ng/contact"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
