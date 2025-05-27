import Image from "next/image"
import Link from "next/link"
import { Bookmark, Home, Bed, Bath, Car } from "lucide-react"
import type { Property } from "@/types"
import { formatPrice } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Construir a URL do imóvel
  const propertyUrl =
    property.neighborhood?.city?.state?.slug && property.neighborhood?.city?.slug && property.neighborhood?.slug
      ? `/${property.neighborhood.city.state.slug}/${property.neighborhood.city.slug}/${property.neighborhood.slug}/${property.slug}`
      : "#"

  // Obter a imagem principal ou a primeira imagem
  const mainImage = property.images?.find((img) => img.is_main) || property.images?.[0]
  const imageUrl = mainImage?.url || "/placeholder.svg?height=400&width=600&query=modern+apartment"

  return (
    <Link
      href={propertyUrl}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
    >
      {/* Property Image */}
      <div className="relative aspect-[4/3]">
        <Image src={imageUrl || "/placeholder.svg"} alt={property.name} fill className="object-cover" />
        {property.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Destaque
            </span>
          </div>
        )}
        <button className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Bookmark className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Property Info */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            {property.name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          <span className="font-medium">{property.status}</span>{" "}
          {property.neighborhood?.name && `no ${property.neighborhood.name}`}
          {property.neighborhood?.city?.name && `, ${property.neighborhood.city.name}`}
        </p>

        {/* Property Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              <span>
                {property.area_min} {property.area_max ? `a ${property.area_max}` : ""} m²
              </span>
            </div>
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            {property.parking_spots > 0 && (
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                <span>
                  {property.parking_spots} vaga{property.parking_spots !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="border-t pt-3">
          <p className="text-sm text-gray-600 mb-1">Venda a partir de</p>
          <p className="text-xl font-bold text-gray-900">{formatPrice(property.price_min)}</p>
        </div>
      </div>
    </Link>
  )
}
