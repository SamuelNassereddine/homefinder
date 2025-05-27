import { createServerSupabaseClient } from "@/lib/supabase"
import type { SupabaseProperty } from "@/types/supabase-property"
import { slugify } from "@/lib/utils"
import { storageService } from "./supabase-storage-service"

export class SupabasePropertyService {
  private supabase = createServerSupabaseClient()

  async createProperty(
    propertyData: Omit<SupabaseProperty, "id" | "created_at" | "updated_at">,
  ): Promise<SupabaseProperty> {
    try {
      console.log("🏠 Criando propriedade:", propertyData.name)

      // Gerar slug único
      const slug = await this.generateUniqueSlug(propertyData.name)

      const dataToInsert = {
        ...propertyData,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("📝 Dados para inserção:", dataToInsert)

      const { data, error } = await this.supabase.from("properties").insert([dataToInsert]).select().single()

      if (error) {
        console.error("❌ Erro detalhado ao criar propriedade:", error)
        throw new Error(`Erro ao criar propriedade: ${error.message}`)
      }

      console.log("✅ Propriedade criada com sucesso:", data)
      return data
    } catch (error) {
      console.error("💥 Erro no serviço de criação:", error)
      throw error
    }
  }

  async updateProperty(id: number, propertyData: Partial<SupabaseProperty>): Promise<SupabaseProperty> {
    try {
      const { data, error } = await this.supabase
        .from("properties")
        .update({
          ...propertyData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Erro ao atualizar propriedade:", error)
        throw new Error(`Erro ao atualizar propriedade: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Erro no serviço de atualização:", error)
      throw error
    }
  }

  async deleteProperty(id: number): Promise<void> {
    try {
      // Primeiro deletar imagens do storage
      await storageService.deletePropertyImages(id)

      // Deletar imagens relacionadas no banco
      await this.supabase.from("property_images").delete().eq("property_id", id)

      // Deletar amenities relacionadas
      await this.supabase.from("property_amenities").delete().eq("property_id", id)

      // Deletar detalhes de apartamento se existir
      await this.supabase.from("apartment_details").delete().eq("property_id", id)

      // Por fim deletar a propriedade
      const { error } = await this.supabase.from("properties").delete().eq("id", id)

      if (error) {
        console.error("Erro ao deletar propriedade:", error)
        throw new Error(`Erro ao deletar propriedade: ${error.message}`)
      }
    } catch (error) {
      console.error("Erro no serviço de deleção:", error)
      throw error
    }
  }

  async getProperty(id: number): Promise<SupabaseProperty | null> {
    try {
      const { data, error } = await this.supabase
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
        .eq("id", id)
        .single()

      if (error) {
        console.error("Erro ao buscar propriedade:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Erro no serviço de busca:", error)
      return null
    }
  }

  async getAllProperties(): Promise<SupabaseProperty[]> {
    try {
      const { data, error } = await this.supabase
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
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erro ao buscar propriedades:", error)
        throw new Error(`Erro ao buscar propriedades: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error("Erro no serviço de listagem:", error)
      throw error
    }
  }

  async addPropertyImages(propertyId: number, files: File[]): Promise<void> {
    try {
      console.log(`🖼️ Processando ${files.length} imagens para propriedade ${propertyId}`)

      // Garantir que o bucket existe
      await storageService.createBucketIfNotExists()

      // Upload das imagens para o Supabase Storage
      const imageUrls = await storageService.uploadPropertyImages(propertyId, files)

      // Salvar URLs no banco de dados
      const images = imageUrls.map((url, index) => ({
        property_id: propertyId,
        url,
        alt_text: `Imagem ${index + 1}`,
        is_main: index === 0,
        display_order: index + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      const { error } = await this.supabase.from("property_images").insert(images)

      if (error) {
        console.error("Erro ao salvar URLs das imagens:", error)
        throw new Error(`Erro ao salvar imagens: ${error.message}`)
      }

      console.log(`✅ ${imageUrls.length} imagens salvas com sucesso`)
    } catch (error) {
      console.error("Erro no serviço de imagens:", error)
      throw error
    }
  }

  async addPropertyAmenities(propertyId: number, amenityIds: number[]): Promise<void> {
    try {
      const amenities = amenityIds.map((amenityId) => ({
        property_id: propertyId,
        amenity_id: amenityId,
      }))

      const { error } = await this.supabase.from("property_amenities").insert(amenities)

      if (error) {
        console.error("Erro ao adicionar amenities:", error)
        throw new Error(`Erro ao adicionar amenities: ${error.message}`)
      }
    } catch (error) {
      console.error("Erro no serviço de amenities:", error)
      throw error
    }
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data } = await this.supabase.from("properties").select("id").eq("slug", slug).single()

      if (!data) break

      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }
}

export const propertyService = new SupabasePropertyService()
