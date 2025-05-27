import { NextResponse } from "next/server"
import { locationService } from "@/lib/services/location-service-real"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get("city_id")

    if (!cityId) {
      return NextResponse.json({ error: "city_id é obrigatório" }, { status: 400 })
    }

    const neighborhoods = await locationService.getNeighborhoodsByCity(Number(cityId))
    return NextResponse.json(neighborhoods)
  } catch (error) {
    console.error("Erro ao buscar bairros:", error)
    return NextResponse.json({ error: "Erro ao buscar bairros" }, { status: 500 })
  }
}
