import { createServerSupabaseClient } from "@/lib/supabase"
import type { State, City, Neighborhood } from "@/types"
import type { CEPResponse } from "@/types/supabase-property"

export class LocationService {
  private supabase = createServerSupabaseClient()

  async getStates(): Promise<State[]> {
    try {
      const { data, error } = await this.supabase.from("states").select("*").order("name")

      if (error) {
        console.error("Erro ao buscar estados:", error)
        throw new Error(`Erro ao buscar estados: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error("Erro no serviço de estados:", error)
      throw error
    }
  }

  async getCitiesByState(stateId: number): Promise<City[]> {
    try {
      const { data, error } = await this.supabase
        .from("cities")
        .select("*, state:states(*)")
        .eq("state_id", stateId)
        .order("name")

      if (error) {
        console.error("Erro ao buscar cidades:", error)
        throw new Error(`Erro ao buscar cidades: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error("Erro no serviço de cidades:", error)
      throw error
    }
  }

  async getNeighborhoodsByCity(cityId: number): Promise<Neighborhood[]> {
    try {
      const { data, error } = await this.supabase
        .from("neighborhoods")
        .select("*, city:cities(*)")
        .eq("city_id", cityId)
        .order("name")

      if (error) {
        console.error("Erro ao buscar bairros:", error)
        throw new Error(`Erro ao buscar bairros: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error("Erro no serviço de bairros:", error)
      throw error
    }
  }

  async getAmenities() {
    try {
      const { data, error } = await this.supabase.from("amenities").select("*").order("name")

      if (error) {
        console.error("Erro ao buscar amenities:", error)
        throw new Error(`Erro ao buscar amenities: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error("Erro no serviço de amenities:", error)
      throw error
    }
  }

  async searchCEP(cep: string): Promise<CEPResponse> {
    try {
      const cleanCEP = cep.replace(/\D/g, "")

      if (cleanCEP.length !== 8) {
        throw new Error("CEP deve ter 8 dígitos")
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
      const data = await response.json()

      if (data.erro) {
        throw new Error("CEP não encontrado")
      }

      return data
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      throw error
    }
  }

  // NOVA FUNÇÃO: Criar bairro automaticamente se não existir
  async findOrCreateNeighborhood(name: string, cityId: number): Promise<Neighborhood> {
    try {
      console.log(`Buscando/criando bairro: ${name} na cidade ${cityId}`)

      // Primeiro tenta encontrar o bairro existente (busca case-insensitive)
      const { data: existing, error: searchError } = await this.supabase
        .from("neighborhoods")
        .select("*")
        .eq("city_id", cityId)
        .ilike("name", name)
        .single()

      if (existing && !searchError) {
        console.log("Bairro encontrado:", existing)
        return existing
      }

      console.log("Bairro não encontrado, criando novo...")

      // Se não existe, cria um novo
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      const { data: newNeighborhood, error } = await this.supabase
        .from("neighborhoods")
        .insert([
          {
            name: name.trim(),
            slug,
            city_id: cityId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Erro detalhado ao criar bairro:", error)
        throw new Error(`Erro ao criar bairro: ${error.message}`)
      }

      console.log("Bairro criado com sucesso:", newNeighborhood)
      return newNeighborhood
    } catch (error) {
      console.error("Erro no serviço de bairro:", error)
      throw error
    }
  }
}

export const locationService = new LocationService()
