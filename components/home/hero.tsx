"use client"

import type React from "react"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { slugify } from "@/lib/utils"

export default function Hero() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    // Simplificação: assumindo que o termo de busca é uma cidade
    const citySlug = slugify(searchTerm)
    router.push(`/sp/${citySlug}`)
  }

  return (
    <section className="relative py-20 flex items-center justify-start min-h-[500px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/placeholder.svg?height=800&width=1600&query=modern+apartment+living+room')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Você apto
            <br />
            para comprar
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white mb-8 font-medium">Onde você quer morar?</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg p-2 shadow-lg max-w-lg">
            <div className="flex items-center gap-2">
              <div className="flex items-center flex-1 px-3">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Bairro, cidade ou empreendimento"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder:text-gray-500 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-semibold text-base"
              >
                BUSCAR
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
