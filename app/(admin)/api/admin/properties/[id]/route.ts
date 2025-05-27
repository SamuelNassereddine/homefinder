import { NextResponse } from "next/server"
import { propertyService } from "@/lib/services/supabase-property-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const property = await propertyService.getProperty(Number(params.id))

    if (!property) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Erro ao buscar propriedade:", error)
    return NextResponse.json({ error: "Erro ao buscar propriedade" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const propertyDataStr = formData.get("propertyData") as string

    if (!propertyDataStr) {
      return NextResponse.json({ error: "Dados da propriedade são obrigatórios" }, { status: 400 })
    }

    const propertyData = JSON.parse(propertyDataStr)

    // Atualizar propriedade
    const updatedProperty = await propertyService.updateProperty(Number(params.id), {
      name: propertyData.name,
      description: propertyData.description,
      status: propertyData.status,
      property_type: propertyData.property_type,
      address: propertyData.address,
      neighborhood_id: propertyData.neighborhood_id,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      suites: propertyData.suites,
      parking_spots: propertyData.parking_spots,
      area_min: propertyData.area_min,
      area_max: propertyData.area_max,
      price_min: propertyData.price_min,
      price_max: propertyData.price_max,
      featured: propertyData.featured,
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error("Erro ao atualizar propriedade:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await propertyService.deleteProperty(Number(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar propriedade:", error)
    return NextResponse.json({ error: "Erro ao deletar propriedade" }, { status: 500 })
  }
}
