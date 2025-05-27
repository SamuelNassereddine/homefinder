import Hero from "@/components/home/hero"
import PropertyGrid from "@/components/property/property-grid"
import { getFeaturedProperties } from "@/lib/services/property-service"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return (
        <>
          <Hero />
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Configuração Necessária</h2>
              <p className="text-gray-600 mb-8">
                Para ver os imóveis reais, você precisa fazer o deploy na Vercel com as variáveis de ambiente do
                Supabase configuradas.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-blue-900 mb-2">Como fazer o deploy:</h3>
                <ol className="text-blue-800 text-sm space-y-1">
                  <li>1. Clique em "Download Code" no v0</li>
                  <li>2. Faça upload do projeto na Vercel</li>
                  <li>3. Configure as variáveis de ambiente:</li>
                  <li className="ml-4">• NEXT_PUBLIC_SUPABASE_URL</li>
                  <li className="ml-4">• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>4. Deploy automático com dados reais!</li>
                </ol>
              </div>
            </div>
          </div>
        </>
      )
    }

    // Buscar imóveis em destaque
    const featuredProperties = await getFeaturedProperties(4)

    return (
      <>
        <Hero />
        <PropertyGrid
          properties={featuredProperties}
          title="Escolhidos para você próximos de"
          location="São Paulo"
          subtitle="DESTAQUES"
          emptyMessage="Nenhum imóvel em destaque encontrado."
          showMoreLink="/sp/sao-paulo"
          showMoreText="VER MAIS OPÇÕES EM SÃO PAULO"
        />
      </>
    )
  } catch (error) {
    console.error("Erro na página inicial:", error)

    return (
      <>
        <Hero />
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔌 Erro de Conexão</h2>
            <p className="text-gray-600 mb-8">
              Não foi possível conectar ao banco de dados. Verifique se as variáveis de ambiente estão configuradas
              corretamente.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-lg mx-auto">
              <p className="text-red-800 text-sm">
                <strong>Erro:</strong> {error instanceof Error ? error.message : "Erro desconhecido"}
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }
}
