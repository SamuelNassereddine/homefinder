import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-2xl font-bold">homefinder</span>
            </div>
            <p className="text-gray-400 text-sm">
              Encontre o imóvel dos seus sonhos em São Paulo. Apartamentos, casas e studios em lançamento, construção ou
              prontos para morar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/buscar" className="hover:text-white transition-colors">
                  Buscar Imóveis
                </Link>
              </li>
              <li>
                <Link href="/sp/sao-paulo" className="hover:text-white transition-colors">
                  Imóveis em São Paulo
                </Link>
              </li>
              <li>
                <Link href="/sp/sao-bernardo-do-campo" className="hover:text-white transition-colors">
                  Imóveis em São Bernardo
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h3 className="font-semibold mb-4">Para Profissionais</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/construtoras" className="hover:text-white transition-colors">
                  Construtoras
                </Link>
              </li>
              <li>
                <Link href="/corretores" className="hover:text-white transition-colors">
                  Corretores
                </Link>
              </li>
              <li>
                <Link href="/imobiliarias" className="hover:text-white transition-colors">
                  Imobiliárias
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <p className="text-sm text-gray-400 mb-4">
              contato@homefinder.com.br
              <br />
              (11) 9999-9999
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 HomeFinder. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
