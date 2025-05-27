import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PropertyGrid from "@/components/property/property-grid"
import PropertyFilters from "@/components/property/property-filters"
import { getNeighborhoodBySlug } from "@/lib/services/location-service"
import { getPropertiesByLocation } from "@/lib/services/property-service"

interface NeighborhoodPageProps {
  params: {
    state: string
    city: string
    neighborhood: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export async function generateMetadata({ params }: NeighborhoodPageProps): Promise<Metadata> {
  const neighborhood = await getNeighborhoodBySlug(params.state, params.city, params.neighborhood)

  if (!neighborhood) {
    return {
      title: "Bairro não encontrado | HomeFinder",
      description: "O bairro que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `Imóveis em ${neighborhood.name}, ${neighborhood.city?.name} - ${neighborhood.city?.state?.uf} | HomeFinder`,
    description: `Encontre os melhores imóveis em ${neighborhood.name}, ${neighborhood.city?.name}. Lançamentos, imóveis em construção e prontos para morar.`,
  }
}

export default async function NeighborhoodPage({ params, searchParams }: NeighborhoodPageProps) {
  const neighborhood = await getNeighborhoodBySlug(params.state, params.city, params.neighborhood)

  if (!neighborhood) {
    notFound()
  }

  // Extrair filtros dos parâmetros de busca
  const filters = {
    status: Array.isArray(searchParams.status)
      ? searchParams.status
      : searchParams.status
        ? [searchParams.status]
        : undefined,
    bedrooms: Array.isArray(searchParams.bedrooms)
      ? searchParams.bedrooms.map(Number)
      : searchParams.bedrooms
        ? [Number(searchParams.bedrooms)]
        : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
  }

  const properties = await getPropertiesByLocation(params.state, params.city, params.neighborhood, filters)

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Imóveis em {neighborhood.name}, {neighborhood.city?.name} - {neighborhood.city?.state?.uf}
          </h1>
          <p className="text-gray-600 mt-2">
            Encontre os melhores imóveis em {neighborhood.name}. Lançamentos, imóveis em construção e prontos para
            morar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <PropertyFilters initialFilters={filters} />
          </div>

          <div className="md:col-span-3">
            <PropertyGrid
              properties={properties}
              title={`Imóveis em ${neighborhood.name}`}
              emptyMessage={`Nenhum imóvel encontrado em ${neighborhood.name} com os filtros selecionados.`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
