import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer()
    const { name, email, phone, propertyId, message } = await request.json()

    // Validar dados obrigatórios
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Nome, email e telefone são obrigatórios" }, { status: 400 })
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    console.log("Tentando inserir lead:", { name, email, phone, propertyId })

    // Inserir lead no banco de dados
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          property_id: propertyId || null,
          message: message?.trim() || null,
          status: "Novo",
        },
      ])
      .select()

    if (error) {
      console.error("Erro ao inserir lead:", error)
      return NextResponse.json({ error: "Erro ao salvar os dados. Tente novamente." }, { status: 500 })
    }

    console.log("Lead inserido com sucesso:", data)

    return NextResponse.json({
      success: true,
      message: "Lead capturado com sucesso!",
      data,
    })
  } catch (error) {
    console.error("Erro ao processar requisição de lead:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    const { data: leads, error } = await supabase
      .from("leads")
      .select(`
        *,
        property:properties(
          id,
          name,
          slug,
          neighborhood:neighborhoods(
            *,
            city:cities(
              *,
              state:states(*)
            )
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar leads:", error)
      return NextResponse.json({ error: "Erro ao buscar leads" }, { status: 500 })
    }

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
