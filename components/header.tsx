"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Search, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              <span className="text-2xl font-bold text-blue-600">homefinder</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2 text-sm font-medium">
                    <span>{item.title}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {item.items.map((subItem) => (
                    <DropdownMenuItem key={subItem.title} asChild>
                      <Link
                        href={subItem.href}
                        className="w-full px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                      >
                        {subItem.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Admin Link */}
            <Link href="/admin" className="hidden md:block">
              <Button variant="ghost" size="sm" className="p-2">
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>

            {/* Search Button */}
            <Link href="/buscar">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-4">
                <Search className="w-4 h-4" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {menuItems.map((item) => (
              <div key={item.title} className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <div className="space-y-1 pl-4">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/admin"
              className="block py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Área Administrativa
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
