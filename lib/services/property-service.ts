import { getSupabaseServer } from "@/lib/supabase/server"
import type { Property } from "@/types"

export async function getFeaturedProperties(limit = 4): Promise<Property[]> {
  try {
    const supabase = getSupabaseServer()

    console.log("Buscando imóveis em destaque...")

    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        neighborhood:neighborhoods(
          *,
          city:cities(
            *,
            state:states(*)
          )
        ),
        images:property_images(*),
        amenities:property_amenities(
          amenity:amenities(*)
        )
      `)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Erro ao buscar imóveis em destaque:", error)
      return []
    }

    console.log("Imóveis encontrados:", data?.length || 0)

    // Transformar os dados para o formato esperado
    const properties =
      data?.map((property: any) => {
        // Transformar amenities para o formato esperado
        if (property.amenities) {
          property.amenities = property.amenities.map((item: any) => item.amenity)
        }
        return property
      }) || []

    return properties as Property[]
  } catch (error) {
    console.error("Erro geral ao buscar imóveis em destaque:", error)
    return []
  }
}

export async function getPropertiesByLocation(
  stateSlug?: string,
  citySlug?: string,
  neighborhoodSlug?: string,
  filters?: any,
): Promise<Property[]> {
  try {
    const supabase = getSupabaseServer()

    let query = supabase.from("properties").select(`
      *,
      neighborhood:neighborhoods(
        *,
        city:cities(
          *,
          state:states(*)
        )
      ),
      images:property_images(*),
      amenities:property_amenities(
        amenity:amenities(*)
      )
    `)

    // Filtrar por localização
    if (stateSlug) {
      query = query.eq("neighborhood.city.state.slug", stateSlug)
    }

    if (citySlug) {
      query = query.eq("neighborhood.city.slug", citySlug)
    }

    if (neighborhoodSlug) {
      query = query.eq("neighborhood.slug", neighborhoodSlug)
    }

    // Aplicar filtros adicionais
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        query = query.in("status", filters.status)
      }

      if (filters.bedrooms && filters.bedrooms.length > 0) {
        query = query.in("bedrooms", filters.bedrooms)
      }

      if (filters.minPrice) {
        query = query.gte("price_min", filters.minPrice)
      }

      if (filters.maxPrice) {
        query = query.lte("price_min", filters.maxPrice)
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar imóveis por localização:", error)
      return []
    }

    // Transformar os dados para o formato esperado
    const properties =
      data?.map((property: any) => {
        // Transformar amenities para o formato esperado
        if (property.amenities) {
          property.amenities = property.amenities.map((item: any) => item.amenity)
        }
        return property
      }) || []

    return properties as Property[]
  } catch (error) {
    console.error("Erro ao buscar imóveis por localização:", error)
    return []
  }
}

export async function getPropertyBySlug(
  stateSlug: string,
  citySlug: string,
  neighborhoodSlug: string,
  propertySlug: string,
): Promise<Property | null> {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        neighborhood:neighborhoods(
          *,
          city:cities(
            *,
            state:states(*)
          )
        ),
        images:property_images(*),
        amenities:property_amenities(
          amenity:amenities(*)
        ),
        apartment_details:apartment_details(*)
      `)
      .eq("neighborhood.city.state.slug", stateSlug)
      .eq("neighborhood.city.slug", citySlug)
      .eq("neighborhood.slug", neighborhoodSlug)
      .eq("slug", propertySlug)
      .single()

    if (error) {
      console.error("Erro ao buscar imóvel por slug:", error)
      return null
    }

    // Transformar os dados para o formato esperado
    const property = data as any

    // Transformar amenities para o formato esperado
    if (property.amenities) {
      property.amenities = property.amenities.map((item: any) => item.amenity)
    }

    return property as Property
  } catch (error) {
    console.error("Erro ao buscar imóvel por slug:", error)
    return null
  }
}
