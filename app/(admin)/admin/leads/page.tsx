"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLeadsPage() {
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
              <Link href="/admin/properties" className="text-gray-600 hover:text-blue-600">
                Imóveis
              </Link>
              <Link href="/admin/leads" className="text-blue-600 font-medium">
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Leads</h1>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📧 Gerenciamento de Leads</h2>
          <p className="text-gray-600 mb-6">
            Esta funcionalidade estará disponível quando você fizer o deploy na Vercel com acesso ao banco de dados.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
            <h3 className="font-medium text-green-900 mb-2">No deploy real você poderá:</h3>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Visualizar todos os leads capturados</li>
              <li>• Ver detalhes de contato e interesse</li>
              <li>• Atualizar status dos leads</li>
              <li>• Filtrar por imóvel de interesse</li>
              <li>• Exportar dados para CRM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
