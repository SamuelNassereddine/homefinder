import { getSupabaseServer } from "@/lib/supabase/server"
import PropertyGrid from "@/components/property/property-grid"
import PropertyFilters from "@/components/property/property-filters"
import { getStates } from "@/lib/services/location-service"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buscar Imóveis | HomeFinder",
  description:
    "Encontre o imóvel dos seus sonhos. Apartamentos, casas e studios em lançamento, construção ou prontos para morar.",
}

interface SearchPageProps {
  searchParams: {
    q?: string
    status?: string | string[]
    bedrooms?: string | string[]
    minPrice?: string
    maxPrice?: string
    neighborhood?: string | string[]
    [key: string]: string | string[] | undefined
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = getSupabaseServer()
  const states = await getStates()

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
    neighborhood: Array.isArray(searchParams.neighborhood)
      ? searchParams.neighborhood
      : searchParams.neighborhood
        ? [searchParams.neighborhood]
        : undefined,
  }

  // Construir query
  let query = supabase.from("properties").select(`
      *,
      neighborhood:neighborhoods(
        *,
        city:cities(
          *,
          state:states(*)
        )
      ),
      images:property_images(*)
    `)

  // Aplicar filtros
  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
  }

  if (filters.status?.length) {
    query = query.in("status", filters.status)
  }

  if (filters.bedrooms?.length) {
    query = query.in("bedrooms", filters.bedrooms)
  }

  if (filters.minPrice) {
    query = query.gte("price_min", filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte("price_min", filters.maxPrice)
  }

  if (filters.neighborhood?.length) {
    query = query.in("neighborhood.slug", filters.neighborhood)
  }

  const { data: properties } = await query.order("created_at", { ascending: false })

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buscar Imóveis</h1>
          {searchParams.q && (
            <p className="text-gray-600 mt-2">
              Resultados da busca por: <span className="font-medium">{searchParams.q}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <PropertyFilters initialFilters={filters} />
          </div>

          <div className="md:col-span-3">
            <PropertyGrid
              properties={properties || []}
              title="Imóveis encontrados"
              emptyMessage="Nenhum imóvel encontrado com os filtros selecionados."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
