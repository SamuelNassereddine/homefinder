"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Bed, Bath, Car, Home, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import LeadFormModal from "@/components/property/lead-form-modal"
import { formatPrice } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyPageProps {
  
    state: string
    city: string
    neighborhood: string
    slug: string
  
}

export default function PropertyClientPage({ params }: any) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const dataResponse: PropertyPageProps = JSON.parse(params.value)
        const response = await fetch(
          `/api/properties/${dataResponse.state}/${dataResponse.city}/${dataResponse.neighborhood}/${dataResponse.slug}`,
        )

        if (!response.ok) {
          throw new Error("Imóvel não encontrado")
        }

        const data = await response.json()
        setProperty(data)
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [params])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!property) {
    notFound()
  }

  const images = property.images || []
  const mainImage = images[activeImageIndex] || { url: "/placeholder.svg?height=600&width=800&query=modern+apartment" }

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500">
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href={`/${params.state}`} className="hover:text-blue-600">
              {property.neighborhood?.city?.state?.name}
            </a>
            <span className="mx-2">/</span>
            <a href={`/${params.state}/${params.city}`} className="hover:text-blue-600">
              {property.neighborhood?.city?.name}
            </a>
            <span className="mx-2">/</span>
            <a href={`/${params.state}/${params.city}/${params.neighborhood}`} className="hover:text-blue-600">
              {property.neighborhood?.name}
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{property.name}</span>
          </div>

          {/* Property Header */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {property.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {property.address}
            </p>
          </div>

          {/* Property Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={mainImage.url || "/placeholder.svg"}
                  alt={mainImage.alt_text || property.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <div
                  key={image.id}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    index === activeImageIndex ? "ring-2 ring-blue-600" : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt_text || `${property.name} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Property Details */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Detalhes do Imóvel</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-sm text-gray-500">Área</span>
                    <span className="font-semibold">
                      {property.area_min} {property.area_max ? `a ${property.area_max}` : ""} m²
                    </span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-sm text-gray-500">Quartos</span>
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Bath className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-sm text-gray-500">Banheiros</span>
                    <span className="font-semibold">{property.bathrooms}</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-sm text-gray-500">Vagas</span>
                    <span className="font-semibold">{property.parking_spots}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold mb-4">Comodidades</h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center">
                        <Check className="w-4 h-4 text-blue-600 mr-2" />
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apartment Details */}
              {property.property_type === "Apartamento" && property.apartment_details && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold mb-4">Detalhes do Condomínio</h2>

                  <div className="grid grid-cols-2 gap-4">
                    {property.apartment_details.land_size && (
                      <div>
                        <span className="text-sm text-gray-500">Tamanho do Terreno</span>
                        <p className="font-semibold">{property.apartment_details.land_size} m²</p>
                      </div>
                    )}

                    {property.apartment_details.towers_count && (
                      <div>
                        <span className="text-sm text-gray-500">Torres</span>
                        <p className="font-semibold">{property.apartment_details.towers_count}</p>
                      </div>
                    )}

                    {property.apartment_details.floors_count && (
                      <div>
                        <span className="text-sm text-gray-500">Andares</span>
                        <p className="font-semibold">{property.apartment_details.floors_count}</p>
                      </div>
                    )}

                    {property.apartment_details.units_count && (
                      <div>
                        <span className="text-sm text-gray-500">Unidades</span>
                        <p className="font-semibold">{property.apartment_details.units_count}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Informações de Venda</h2>

                <div className="mb-4">
                  <span className="text-sm text-gray-500">Preço a partir de</span>
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(property.price_min)}</p>
                </div>

                <Button onClick={() => setIsLeadModalOpen(true)} className="w-full mb-4" size="lg">
                  Tenho Interesse
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Entre em contato para mais informações sobre este imóvel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      <LeadFormModal
        propertyId={property.id}
        propertyName={property.name}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </>
  )
}
