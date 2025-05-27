"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true)
    console.log("✅ AdminLoginPage carregada - SEM interferência de rotas dinâmicas!")
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Credenciais de teste
      if (formData.email === "admin@homefinder.com" && formData.password === "admin123") {
        localStorage.setItem("admin_logged_in", "true")
        router.push("/admin")
      } else {
        throw new Error("Email ou senha incorretos")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  // Não renderizar até estar montado no cliente
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-2xl font-bold text-blue-600 ml-2">apto</span>
          <span className="text-lg font-medium text-gray-500 ml-2">Admin</span>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Login Administrativo</h1>

        {/* Credenciais de teste */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
          <p className="text-blue-900 font-medium text-sm mb-1">Credenciais de teste:</p>
          <p className="text-blue-800 text-sm">Email: admin@homefinder.com</p>
          <p className="text-blue-800 text-sm">Senha: admin123</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@homefinder.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="admin123"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>

        {/* Status de funcionamento */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-green-900 font-medium text-sm mb-1">🎯 PROBLEMA RESOLVIDO!</p>
          <p className="text-green-800 text-xs">Rotas admin isoladas com Route Groups - sem conflitos!</p>
        </div>
      </div>
    </div>
  )
}
