import { NextResponse } from "next/server"
import { locationService } from "@/lib/services/location-service-real"

export async function POST(request: Request) {
  try {
    const { name, cityId } = await request.json()

    if (!name || !cityId) {
      return NextResponse.json({ error: "Nome e cityId são obrigatórios" }, { status: 400 })
    }

    console.log(`Testando criação de bairro: ${name} na cidade ${cityId}`)

    const neighborhood = await locationService.findOrCreateNeighborhood(name, cityId)

    return NextResponse.json({
      success: true,
      neighborhood,
      message: "Bairro criado/encontrado com sucesso",
    })
  } catch (error) {
    console.error("Erro no teste de bairro:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}
