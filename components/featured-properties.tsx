"use client"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property-card"
import type { Property } from "@/types/database"

interface FeaturedPropertiesProps {
  properties: Property[]
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">DESTAQUES</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Escolhidos para você próximos de</h2>
          <div className="inline-block">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1">São Paulo</h3>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="text-center">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg"
            onClick={() => (window.location.href = "/sp/sao-paulo")}
          >
            VER MAIS OPÇÕES EM SÃO PAULO
          </Button>
        </div>
      </div>
    </section>
  )
}
