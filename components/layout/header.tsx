"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  const menuItems = [
    {
      title: "Para construtoras",
      href: "/construtoras",
      items: [
        { title: "Divulgar empreendimentos", href: "/construtoras/divulgar" },
        { title: "Gerenciar leads", href: "/construtoras/leads" },
        { title: "Relatórios de vendas", href: "/construtoras/relatorios" },
        { title: "Planos e preços", href: "/construtoras/planos" },
      ],
    },
    {
      title: "Para corretores",
      href: "/corretores",
      items: [
        { title: "Cadastrar imóveis", href: "/corretores/cadastrar" },
        { title: "Gerenciar carteira", href: "/corretores/carteira" },
        { title: "Ferramentas de venda", href: "/corretores/ferramentas" },
        { title: "Comissões", href: "/corretores/comissoes" },
      ],
    },
    {
      title: "Para imobiliárias",
      href: "/imobiliarias",
      items: [
        { title: "Portal da imobiliária", href: "/imobiliarias/portal" },
        { title: "Gestão de equipe", href: "/imobiliarias/equipe" },
        { title: "Relatórios gerenciais", href: "/imobiliarias/relatorios" },
        { title: "Integração CRM", href: "/imobiliarias/crm" },
      ],
    },
    {
      title: "Para compradores",
      href: "/compradores",
      items: [
        { title: "Buscar imóveis", href: "/buscar" },
        { title: "Financiamento", href: "/financiamento" },
        { title: "Meus favoritos", href: "/favoritos" },
        { title: "Alertas de imóveis", href: "/alertas" },
      ],
    },
  ]

  if (isAdmin) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <span className="text-2xl font-bold text-blue-600">apto</span>
                <span className="text-sm font-medium text-gray-500">Admin</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/admin/properties" className="text-gray-600 hover:text-blue-600">
                Imóveis
              </Link>
              <Link href="/admin/leads" className="text-gray-600 hover:text-blue-600">
                Leads
              </Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Ver site
              </Link>
              <Button variant="ghost" size="sm" className="p-2">
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-2xl font-bold text-blue-600">apto</span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.title} className="relative">
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2 text-sm font-medium"
                  onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                >
                  <span>{item.title}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === item.title && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* User Icon */}
            <Button variant="ghost" size="sm" className="p-2">
              <User className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Search Button */}
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-4">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
