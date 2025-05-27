"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPermissions() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const testPermissions = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Teste simples de criação de propriedade
      const testData = {
        name: "Teste de Permissões",
        description: "Propriedade de teste para verificar permissões",
        status: "Em lançamento",
        property_type: "Apartamento",
        address: "Rua de Teste, 123",
        neighborhood_name: "Bairro Teste",
        city_id: 1, // Assumindo que existe uma cidade com ID 1
        bedrooms: 2,
        bathrooms: 1,
        suites: 0,
        parking_spots: 1,
        area_min: 50,
        price_min: 300000,
        featured: false,
        amenities: [],
      }

      const formData = new FormData()
      formData.append("propertyData", JSON.stringify(testData))

      const response = await fetch("/api/admin/properties", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResult(`✅ SUCESSO! Propriedade criada com ID: ${data.id}`)

        // Deletar a propriedade de teste
        await fetch(`/api/admin/properties/${data.id}`, {
          method: "DELETE",
        })
      } else {
        const error = await response.json()
        setResult(`❌ ERRO: ${error.error}`)
      }
    } catch (error) {
      setResult(`💥 ERRO: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🧪 Teste de Permissões</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Clique no botão abaixo para testar se as permissões do banco de dados estão funcionando corretamente.
          </p>

          <Button onClick={testPermissions} disabled={isLoading} className="w-full">
            {isLoading ? "Testando..." : "🚀 Testar Permissões"}
          </Button>

          {result && (
            <div
              className={`p-3 rounded-md text-sm ${
                result.includes("SUCESSO") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {result}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
