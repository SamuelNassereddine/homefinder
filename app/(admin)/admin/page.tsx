"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("admin_logged_in") === "true"
      if (!isLoggedIn) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in")
    router.push("/admin/login")
  }

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
      {/* Header Admin */}
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
              <Link href="/admin/leads" className="text-gray-600 hover:text-blue-600">
                Leads
              </Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Ver site
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 text-sm">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/properties" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold mb-2">Imóveis</h2>
              <p className="text-gray-600 mb-4">Gerenciar imóveis cadastrados</p>
              <div className="flex justify-end">
                <span className="text-blue-600">Acessar →</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/leads" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold mb-2">Leads</h2>
              <p className="text-gray-600 mb-4">Gerenciar leads capturados</p>
              <div className="flex justify-end">
                <span className="text-blue-600">Acessar →</span>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Configurações</h2>
            <p className="text-gray-600 mb-4">Configurações do sistema</p>
            <div className="flex justify-end">
              <span className="text-gray-400">Em breve</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">✅ Sistema Funcionando!</h3>
          <p className="text-green-800 text-sm">
            Login administrativo funcionando perfeitamente. No deploy real, conecte ao banco de dados para
            funcionalidade completa.
          </p>
        </div>
      </div>
    </div>
  )
}
