import { getSupabaseServer } from "@/lib/supabase/server"
import type { State, City, Neighborhood } from "@/types"

export async function getStates(): Promise<State[]> {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase.from("states").select("*").order("name")

    if (error) {
      console.error("Erro ao buscar estados:", error)
      return []
    }

    return data as State[]
  } catch (error) {
    console.error("Erro ao buscar estados:", error)
    return []
  }
}

export async function getStateBySlug(slug: string): Promise<State | null> {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase.from("states").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Erro ao buscar estado por slug:", error)
      return null
    }

    return data as State
  } catch (error) {
    console.error("Erro ao buscar estado por slug:", error)
    return null
  }
}

export async function getCitiesByState(stateId: number): Promise<City[]> {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("cities")
      .select("*, state:states(*)")
      .eq("state_id", stateId)
      .order("name")

    if (error) {
      console.error("Erro ao buscar cidades por estado:", error)
      return []
    }

    return data as City[]
  } catch (error) {
    console.error("Erro ao buscar cidades por estado:", error)
    return []
  }
}

export async function getCityBySlug(stateSlug: string, citySlug: string): Promise<City | null> {
  try {
    const supabase = getSupabaseServer()

    // PROBLEMA ESTAVA AQUI: A query estava incorreta
    // Antes: .eq("state.slug", stateSlug) - isso não funciona com joins
    // Correção: fazer join correto e filtrar adequadamente

    const { data, error } = await supabase
      .from("cities")
      .select(`
        *,
        state:states!inner(*)
      `)
      .eq("slug", citySlug)
      .eq("state.slug", stateSlug)
      .maybeSingle() // MUDANÇA: usar maybeSingle() em vez de single()

    if (error) {
      console.error("Erro ao buscar cidade por slug:", error)
      return null
    }

    return data as City | null
  } catch (error) {
    console.error("Erro ao buscar cidade por slug:", error)
    return null
  }
}

export async function getNeighborhoodsByCity(cityId: number): Promise<Neighborhood[]> {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("neighborhoods")
      .select("*, city:cities(*)")
      .eq("city_id", cityId)
      .order("name")

    if (error) {
      console.error("Erro ao buscar bairros por cidade:", error)
      return []
    }

    return data as Neighborhood[]
  } catch (error) {
    console.error("Erro ao buscar bairros por cidade:", error)
    return []
  }
}

export async function getNeighborhoodBySlug(
  stateSlug: string,
  citySlug: string,
  neighborhoodSlug: string,
): Promise<Neighborhood | null> {
  try {
    const supabase = getSupabaseServer()

    // CORREÇÃO SIMILAR: usar maybeSingle() e join correto
    const { data, error } = await supabase
      .from("neighborhoods")
      .select(`
        *,
        city:cities!inner(
          *,
          state:states!inner(*)
        )
      `)
      .eq("slug", neighborhoodSlug)
      .eq("city.slug", citySlug)
      .eq("city.state.slug", stateSlug)
      .maybeSingle() // MUDANÇA: usar maybeSingle() em vez de single()

    if (error) {
      console.error("Erro ao buscar bairro por slug:", error)
      return null
    }

    return data as Neighborhood | null
  } catch (error) {
    console.error("Erro ao buscar bairro por slug:", error)
    return null
  }
}
