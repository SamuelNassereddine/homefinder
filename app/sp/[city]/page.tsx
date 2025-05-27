import { notFound } from "next/navigation"
import type { Metadata } from "next"
import PropertyFilters from "@/components/property-filters"
import PropertyCard from "@/components/property-card"
import { createServerSupabaseClient } from "@/lib/supabase"

interface CityPageProps {
  params: {
    city: string
  }
  searchParams: {
    bairro?: string
    quartos?: string
    status?: string
    preco_min?: string
    preco_max?: string
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient()

  const { data: city } = await supabase.from("cities").select("*, state:states(*)").eq("slug", params.city).single()

  if (!city) {
    return {
      title: "Cidade não encontrada",
    }
  }

  return {
    title: `Imóveis em ${city.name}, ${city.state.uf} | HomeFinder`,
    description: `Encontre apartamentos, casas e studios em ${city.name}. Imóveis em lançamento, construção e prontos para morar.`,
  }
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const supabase = createServerSupabaseClient()

  // Buscar cidade
  const { data: city } = await supabase.from("cities").select("*, state:states(*)").eq("slug", params.city).single()

  if (!city) {
    notFound()
  }

  // Buscar bairros da cidade
  const { data: neighborhoods } = await supabase.from("neighborhoods").select("*").eq("city_id", city.id).order("name")

  // Construir query de imóveis
  let query = supabase
    .from("properties")
    .select(`
      *,
      neighborhood:neighborhoods!inner(
        *,
        city:cities!inner(
          *,
          state:states(*)
        )
      ),
      images:property_images(*),
      amenities:property_amenities(
        amenity:amenities(*)
      )
    `)
    .eq("neighborhood.city_id", city.id)

  // Aplicar filtros
  if (searchParams.bairro) {
    query = query.eq("neighborhood.slug", searchParams.bairro)
  }
  if (searchParams.quartos) {
    query = query.eq("bedrooms", Number.parseInt(searchParams.quartos))
  }
  if (searchParams.status) {
    query = query.eq("status", searchParams.status)
  }
  if (searchParams.preco_min) {
    query = query.gte("price_min", Number.parseInt(searchParams.preco_min))
  }
  if (searchParams.preco_max) {
    query = query.lte("price_min", Number.parseInt(searchParams.preco_max))
  }

  const { data: properties } = await query.order("featured", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Imóveis em {city.name}, {city.state.uf}
          </h1>
          <p className="text-gray-600 mt-2">{properties?.length || 0} imóveis encontrados</p>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PropertyFilters neighborhoods={neighborhoods || []} currentFilters={searchParams} />
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {properties && properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum imóvel encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
