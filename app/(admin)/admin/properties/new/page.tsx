"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SupabasePropertyForm from "@/components/admin/supabase-property-form"
import Link from "next/link"

export default function NewPropertyPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true"

    if (!isLoggedIn) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <span className="text-2xl font-bold text-blue-600">apto</span>
                <span className="text-sm font-medium text-gray-500">Admin</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/admin/properties" className="text-blue-600 font-medium">
                Imóveis
              </Link>
              <Link href="/admin/leads" className="text-gray-600 hover:text-blue-600">
                Leads
              </Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Ver site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <SupabasePropertyForm />
    </div>
  )
}
