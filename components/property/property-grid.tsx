"use client"

import PropertyCard from "./property-card"
import type { Property } from "@/types"
import { Button } from "@/components/ui/button"

interface PropertyGridProps {
  properties: Property[]
  title?: string
  subtitle?: string
  location?: string
  emptyMessage?: string
  showMoreLink?: string
  showMoreText?: string
}

export default function PropertyGrid({
  properties,
  title = "Imóveis",
  subtitle,
  location,
  emptyMessage = "Nenhum imóvel encontrado",
  showMoreLink,
  showMoreText = "VER MAIS OPÇÕES",
}: PropertyGridProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        {(title || subtitle || location) && (
          <div className="text-center mb-12 relative">
            {subtitle && <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{subtitle}</p>}
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {location && (
              <div className="inline-block">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1">
                  {location}
                </h3>
              </div>
            )}
          </div>
        )}

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{emptyMessage}</p>
          </div>
        )}

        {/* Call to Action Button */}
        {showMoreLink && properties.length > 0 && (
          <div className="text-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg"
              onClick={() => (window.location.href = showMoreLink)}
            >
              {showMoreText}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
