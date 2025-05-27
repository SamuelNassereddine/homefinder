import { createServerSupabaseClient } from "@/lib/supabase"

export class SupabaseStorageService {
  private supabase = createServerSupabaseClient()
  private bucketName = "property-images"

  async uploadPropertyImages(propertyId: number, files: File[]): Promise<string[]> {
    try {
      console.log(`📸 Iniciando upload de ${files.length} imagens para propriedade ${propertyId}`)

      const uploadPromises = files.map(async (file, index) => {
        // Gerar nome único para o arquivo
        const fileExtension = file.name.split(".").pop()
        const fileName = `property-${propertyId}-${Date.now()}-${index}.${fileExtension}`
        const filePath = `properties/${propertyId}/${fileName}`

        console.log(`📤 Fazendo upload: ${fileName}`)

        // Converter File para ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        // Upload para Supabase Storage
        const { data, error } = await this.supabase.storage.from(this.bucketName).upload(filePath, uint8Array, {
          contentType: file.type,
          upsert: false,
        })

        if (error) {
          console.error(`❌ Erro no upload de ${fileName}:`, error)
          throw new Error(`Erro no upload da imagem ${fileName}: ${error.message}`)
        }

        console.log(`✅ Upload concluído: ${fileName}`)

        // Obter URL pública
        const { data: publicUrlData } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath)

        return publicUrlData.publicUrl
      })

      const imageUrls = await Promise.all(uploadPromises)
      console.log(`🎉 Todos os uploads concluídos! URLs:`, imageUrls)

      return imageUrls
    } catch (error) {
      console.error("💥 Erro no serviço de upload:", error)
      throw error
    }
  }

  async deletePropertyImages(propertyId: number): Promise<void> {
    try {
      console.log(`🗑️ Deletando imagens da propriedade ${propertyId}`)

      // Listar arquivos da propriedade
      const { data: files, error: listError } = await this.supabase.storage
        .from(this.bucketName)
        .list(`properties/${propertyId}`)

      if (listError) {
        console.error("Erro ao listar arquivos:", listError)
        return
      }

      if (!files || files.length === 0) {
        console.log("Nenhuma imagem encontrada para deletar")
        return
      }

      // Deletar arquivos
      const filePaths = files.map((file) => `properties/${propertyId}/${file.name}`)

      const { error: deleteError } = await this.supabase.storage.from(this.bucketName).remove(filePaths)

      if (deleteError) {
        console.error("Erro ao deletar arquivos:", deleteError)
      } else {
        console.log(`✅ ${files.length} imagens deletadas com sucesso`)
      }
    } catch (error) {
      console.error("Erro no serviço de deleção:", error)
    }
  }

  async createBucketIfNotExists(): Promise<void> {
    try {
      // Verificar se o bucket existe
      const { data: buckets } = await this.supabase.storage.listBuckets()
      const bucketExists = buckets?.some((bucket) => bucket.name === this.bucketName)

      if (!bucketExists) {
        console.log(`📦 Criando bucket: ${this.bucketName}`)

        const { error } = await this.supabase.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          fileSizeLimit: 5242880, // 5MB
        })

        if (error) {
          console.error("Erro ao criar bucket:", error)
        } else {
          console.log("✅ Bucket criado com sucesso")
        }
      }
    } catch (error) {
      console.error("Erro ao verificar/criar bucket:", error)
    }
  }
}

export const storageService = new SupabaseStorageService()
