import { NextResponse } from "next/server"
import { locationService } from "@/lib/services/location-service-real"

export async function GET() {
  try {
    const amenities = await locationService.getAmenities()
    return NextResponse.json(amenities)
  } catch (error) {
    console.error("Erro ao buscar amenities:", error)
    return NextResponse.json({ error: "Erro ao buscar amenities" }, { status: 500 })
  }
}
