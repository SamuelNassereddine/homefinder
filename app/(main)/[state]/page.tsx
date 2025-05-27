import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PropertyGrid from "@/components/property/property-grid"
import PropertyFilters from "@/components/property/property-filters"
import { getStateBySlug } from "@/lib/services/location-service"
import { getPropertiesByLocation } from "@/lib/services/property-service"
import { getCitiesByState } from "@/lib/services/location-service"

interface StatePageProps {
  params: {
    state: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  try {
    const state = await getStateBySlug(params.state)

    if (!state) {
      return {
        title: "Estado não encontrado | HomeFinder",
        description: "O estado que você está procurando não foi encontrado.",
      }
    }

    return {
      title: `Imóveis em ${state.name} | HomeFinder`,
      description: `Encontre os melhores imóveis em ${state.name}. Lançamentos, imóveis em construção e prontos para morar.`,
    }
  } catch (error) {
    return {
      title: "Erro | HomeFinder",
      description: "Erro ao carregar informações do estado.",
    }
  }
}

export default async function StatePage({ params, searchParams }: StatePageProps) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return (
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">⚠️ Configuração Necessária</h1>
            <p className="text-gray-600">
              Para acessar os dados reais, faça o deploy na Vercel com as variáveis de ambiente configuradas.
            </p>
          </div>
        </div>
      )
    }

    const state = await getStateBySlug(params.state)

    if (!state) {
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
      neighborhood: Array.isArray(searchParams.neighborhood)
        ? searchParams.neighborhood
        : searchParams.neighborhood
          ? [searchParams.neighborhood]
          : undefined,
    }

    const properties = await getPropertiesByLocation(params.state, undefined, undefined, filters)
    const cities = await getCitiesByState(state.id)

    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Imóveis em {state.name}</h1>
            <p className="text-gray-600 mt-2">
              Encontre os melhores imóveis em {state.name}. Lançamentos, imóveis em construção e prontos para morar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <PropertyFilters initialFilters={filters} />
            </div>

            <div className="md:col-span-3">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Cidades em {state.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <a
                      key={city.id}
                      href={`/${params.state}/${city.slug}`}
                      className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      {city.name}
                    </a>
                  ))}
                </div>
              </div>

              <PropertyGrid
                properties={properties}
                title={`Imóveis em ${state.name}`}
                emptyMessage={`Nenhum imóvel encontrado em ${state.name} com os filtros selecionados.`}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erro na página do estado:", error)
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔌 Erro de Conexão</h1>
          <p className="text-gray-600">Erro ao carregar dados do estado. Verifique a configuração do banco de dados.</p>
        </div>
      </div>
    )
  }
}
