import { NextResponse } from "next/server"
import { propertyService } from "@/lib/services/supabase-property-service"
import { locationService } from "@/lib/services/location-service-real"

export async function GET() {
  try {
    const properties = await propertyService.getAllProperties()
    return NextResponse.json(properties)
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error)
    return NextResponse.json({ error: "Erro ao buscar propriedades" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("🚀 Iniciando criação de propriedade...")

    const formData = await request.formData()
    const propertyDataStr = formData.get("propertyData") as string

    if (!propertyDataStr) {
      return NextResponse.json({ error: "Dados da propriedade são obrigatórios" }, { status: 400 })
    }

    const propertyData = JSON.parse(propertyDataStr)
    console.log("📋 Dados recebidos:", propertyData)

    // Validações obrigatórias
    if (!propertyData.name?.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    if (!propertyData.price_min || propertyData.price_min <= 0) {
      return NextResponse.json({ error: "Preço mínimo deve ser maior que zero" }, { status: 400 })
    }

    // Resolver neighborhood_id
    let neighborhoodId = propertyData.neighborhood_id

    if (!neighborhoodId && propertyData.neighborhood_name?.trim() && propertyData.city_id) {
      console.log("🏘️ Criando/buscando bairro:", propertyData.neighborhood_name)

      try {
        const neighborhood = await locationService.findOrCreateNeighborhood(
          propertyData.neighborhood_name.trim(),
          propertyData.city_id,
        )
        neighborhoodId = neighborhood.id
        console.log("✅ Bairro resolvido com ID:", neighborhoodId)
      } catch (error) {
        console.error("❌ Erro ao resolver bairro:", error)
        return NextResponse.json(
          {
            error: `Erro ao criar/encontrar bairro "${propertyData.neighborhood_name}": ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          },
          { status: 400 },
        )
      }
    }

    if (!neighborhoodId) {
      return NextResponse.json({ error: "Bairro é obrigatório" }, { status: 400 })
    }

    // Preparar dados para criação
    const propertyToCreate: Omit<any, "id" | "created_at" | "updated_at"> = {
      name: propertyData.name.trim(),
      slug: "", // Será gerado automaticamente
      description: propertyData.description?.trim() || "",
      status: propertyData.status || "Em lançamento",
      property_type: propertyData.property_type || "Apartamento",
      address: propertyData.address || "",
      neighborhood_id: Number(neighborhoodId),
      bedrooms: Number(propertyData.bedrooms) || 1,
      bathrooms: Number(propertyData.bathrooms) || 1,
      suites: Number(propertyData.suites) || 0,
      parking_spots: Number(propertyData.parking_spots) || 0,
      area_min: Number(propertyData.area_min),
      area_max: propertyData.area_max ? Number(propertyData.area_max) : null,
      price_min: Number(propertyData.price_min),
      price_max: propertyData.price_max ? Number(propertyData.price_max) : null,
      featured: Boolean(propertyData.featured),
      seo_title: null,
      seo_description: null,
    }

    console.log("🏗️ Criando propriedade com dados:", propertyToCreate)

    // Criar propriedade
    const newProperty = await propertyService.createProperty(propertyToCreate)

    console.log("🎉 Propriedade criada:", newProperty)

    // Processar imagens REAIS
    const imageFiles: File[] = []
    for (let i = 0; formData.get(`image_${i}`); i++) {
      const file = formData.get(`image_${i}`) as File
      if (file && file.size > 0) {
        imageFiles.push(file)
      }
    }

    // Upload das imagens se existirem
    if (imageFiles.length > 0) {
      console.log(`🖼️ Fazendo upload de ${imageFiles.length} imagens...`)
      await propertyService.addPropertyImages(newProperty.id!, imageFiles)
    } else {
      console.log("📷 Nenhuma imagem para upload")
    }

    // Adicionar amenities
    if (propertyData.amenities?.length > 0) {
      console.log("🏊 Adicionando amenities:", propertyData.amenities)
      await propertyService.addPropertyAmenities(newProperty.id!, propertyData.amenities)
    }

    console.log("✅ Propriedade criada com sucesso!")
    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error("💥 Erro ao criar propriedade:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
