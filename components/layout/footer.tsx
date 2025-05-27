import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <span className="text-2xl font-bold text-blue-600">apto</span>
          </div>
          <p className="text-gray-600 text-sm">
            Encontre o imóvel perfeito para você e sua família. Lançamentos, imóveis em construção e prontos para morar.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link href="/sp" className="text-gray-600 hover:text-blue-600 text-sm">
                São Paulo
              </Link>
            </li>
            <li>
              <Link href="/sp/sao-paulo" className="text-gray-600 hover:text-blue-600 text-sm">
                São Paulo Capital
              </Link>
            </li>
            <li>
              <Link href="/sp/sao-bernardo-do-campo" className="text-gray-600 hover:text-blue-600 text-sm">
                São Bernardo do Campo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Tipos de Imóveis</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/buscar?tipo=apartamento" className="text-gray-600 hover:text-blue-600 text-sm">
                Apartamentos
              </Link>
            </li>
            <li>
              <Link href="/buscar?tipo=casa" className="text-gray-600 hover:text-blue-600 text-sm">
                Casas
              </Link>
            </li>
            <li>
              <Link href="/buscar?tipo=studio" className="text-gray-600 hover:text-blue-600 text-sm">
                Studios
              </Link>
            </li>
            <li>
              <Link href="/buscar?status=lancamento" className="text-gray-600 hover:text-blue-600 text-sm">
                Lançamentos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Contato</h3>
          <ul className="space-y-2">
            <li className="text-gray-600 text-sm">contato@homefinder.com.br</li>
            <li className="text-gray-600 text-sm">(11) 99999-9999</li>
            <li className="text-gray-600 text-sm">
              Av. Paulista, 1000 - Bela Vista
              <br />
              São Paulo - SP
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} HomeFinder. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
