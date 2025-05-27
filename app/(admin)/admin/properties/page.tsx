"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Eye } from "lucide-react"
import TestPermissions from "@/components/admin/test-permissions"

// Tipo para propriedade com relacionamentos
interface PropertyWithRelations {
  id: number
  name: string
  description: string
  status: string
  property_type: string
  address: string
  bedrooms: number
  bathrooms: number
  suites: number
  parking_spots: number
  area_min: number
  area_max?: number
  price_min: number
  price_max?: number
  featured: boolean
  created_at: string
  updated_at: string
  neighborhood?: {
    id: number
    name: string
    city?: {
      id: number
      name: string
      state?: {
        id: number
        name: string
        uf: string
      }
    }
  }
  images?: Array<{
    id: number
    url: string
    alt_text?: string
    is_main: boolean
  }>
  amenities?: Array<{
    amenity?: {
      id: number
      name: string
    }
  }>
}

export default function AdminPropertiesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<PropertyWithRelations[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true"

    if (!isLoggedIn) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadProperties()
    }

    setIsLoading(false)
  }, [router])

  const loadProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      try {
        const response = await fetch(`/api/admin/properties/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          loadProperties()
          alert("Propriedade excluída com sucesso!")
        } else {
          alert("Erro ao excluir propriedade")
        }
      } catch (error) {
        console.error("Erro ao excluir:", error)
        alert("Erro ao excluir propriedade")
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price)
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Imóveis</h1>
            <p className="text-gray-600">{properties.length} imóveis cadastrados</p>
          </div>
          <Link href="/admin/properties/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imóvel
            </Button>
          </Link>
        </div>

        {/* Teste de Permissões */}
        <TestPermissions />

        {properties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Nenhum imóvel cadastrado</h3>
              <p className="text-gray-600 mb-4">Comece adicionando seu primeiro imóvel</p>
              <Link href="/admin/properties/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Imóvel
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={
                        property.images.find((img) => img.is_main)?.url || property.images[0]?.url || "/placeholder.svg"
                      }
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {property.featured && <Badge className="absolute top-2 left-2 bg-blue-600">Destaque</Badge>}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{property.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(property.price_min)}
                      {property.price_max && property.price_max !== property.price_min && (
                        <span className="text-sm text-gray-500"> - {formatPrice(property.price_max)}</span>
                      )}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {property.property_type}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>

                  {property.neighborhood && (
                    <p className="text-gray-500 text-sm mb-3">
                      {property.neighborhood.name}
                      {property.neighborhood.city && `, ${property.neighborhood.city.name}`}
                      {property.neighborhood.city?.state && ` - ${property.neighborhood.city.state.uf}`}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{property.bedrooms} quartos</span>
                    <span>{property.bathrooms} banheiros</span>
                    <span>{property.area_min}m²</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/admin/properties/${property.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(property.id, property.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">✅ PERMISSÕES CORRIGIDAS!</h3>
          <p className="text-green-800 text-sm">
            As permissões do Supabase foram corrigidas. O sistema de cadastro de propriedades deve estar funcionando
            perfeitamente agora. Use o teste acima para verificar.
          </p>
        </div>
      </div>
    </div>
  )
}
