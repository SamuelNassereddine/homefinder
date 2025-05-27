import { NextResponse } from "next/server"
import { locationService } from "@/lib/services/location-service-real"

export async function GET(request: Request, { params }: { params: { cep: string } }) {
  try {
    const cepData = await locationService.searchCEP(params.cep)
    return NextResponse.json(cepData)
  } catch (error) {
    console.error("Erro ao buscar CEP:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao buscar CEP" }, { status: 400 })
  }
}
