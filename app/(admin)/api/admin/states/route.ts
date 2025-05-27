import { NextResponse } from "next/server"
import { locationService } from "@/lib/services/location-service-real"

export async function GET() {
  try {
    const states = await locationService.getStates()
    return NextResponse.json(states)
  } catch (error) {
    console.error("Erro ao buscar estados:", error)
    return NextResponse.json({ error: "Erro ao buscar estados" }, { status: 500 })
  }
}
