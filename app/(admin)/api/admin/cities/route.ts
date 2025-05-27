import { NextResponse } from "next/server"
import { locationService } from "@/lib/services/location-service-real"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const stateId = searchParams.get("state_id")

    if (!stateId) {
      return NextResponse.json({ error: "state_id é obrigatório" }, { status: 400 })
    }

    const cities = await locationService.getCitiesByState(Number(stateId))
    return NextResponse.json(cities)
  } catch (error) {
    console.error("Erro ao buscar cidades:", error)
    return NextResponse.json({ error: "Erro ao buscar cidades" }, { status: 500 })
  }
}
