import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { state: string; city: string; neighborhood: string; slug: string } },
) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
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
        ),
        apartment_details:apartment_details(*)
      `)
      .eq("neighborhood.city.state.slug", params.state)
      .eq("neighborhood.city.slug", params.city)
      .eq("neighborhood.slug", params.neighborhood)
      .eq("slug", params.slug)
      .single()

    if (error) {
      console.error("Erro ao buscar imóvel:", error)
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
    }

    // Transformar os dados para o formato esperado
    const property = data as any

    // Transformar amenities para o formato esperado
    if (property.amenities) {
      property.amenities = property.amenities.map((item: any) => item.amenity)
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
