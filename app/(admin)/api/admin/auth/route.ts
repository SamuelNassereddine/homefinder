import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer()
    const { email, password } = await request.json()

    // Validar dados
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário no banco de dados
    const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error || !data) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar senha (em produção, use bcrypt para comparar hashes)
    if (data.password !== password) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Criar sessão
    const session = {
      userId: data.id,
      email: data.email,
      name: data.name,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    }

    // Salvar sessão em cookie
    cookies().set("admin_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 24 horas
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
      },
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE() {
  cookies().delete("admin_session")
  return NextResponse.json({ success: true })
}
