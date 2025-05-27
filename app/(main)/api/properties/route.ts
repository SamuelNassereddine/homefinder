import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured") === "true"
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 10

    const supabase = getSupabaseServer()

    let query = supabase
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
      .limit(limit)

    if (featured) {
      query = query.eq("featured", true)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar imóveis:", error)
      return NextResponse.json({ error: "Erro ao buscar imóveis" }, { status: 500 })
    }

    // Transformar os dados para o formato esperado
    const properties = data.map((property: any) => {
      // Transformar amenities para o formato esperado
      if (property.amenities) {
        property.amenities = property.amenities.map((item: any) => item.amenity)
      }
      return property
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
