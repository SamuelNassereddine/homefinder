"use client"

import { useState, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PropertyFilters as PropertyFiltersType } from "@/types"

interface PropertyFiltersProps {
  neighborhoods?: { id: number; name: string; slug: string }[]
  initialFilters?: PropertyFiltersType
  onFilterChange?: (filters: PropertyFiltersType) => void
}

export default function PropertyFilters({ neighborhoods = [], initialFilters, onFilterChange }: PropertyFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Inicializar filtros com base nos parâmetros da URL ou filtros iniciais
  const [filters, setFilters] = useState<PropertyFiltersType>(() => {
    if (initialFilters) {
      return initialFilters
    }

    // Extrair filtros dos parâmetros da URL
    const status = searchParams.getAll("status")
    const bedrooms = searchParams
      .getAll("bedrooms")
      .map(Number)
      .filter((n) => !isNaN(n))
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const neighborhood = searchParams.getAll("neighborhood")

    return {
      status: status.length > 0 ? status : undefined,
      bedrooms: bedrooms.length > 0 ? bedrooms : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      neighborhood: neighborhood.length > 0 ? neighborhood : undefined,
    }
  })

  // Atualizar URL e chamar callback quando os filtros mudarem
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()

    if (filters.status?.length) {
      filters.status.forEach((status) => params.append("status", status))
    }

    if (filters.bedrooms?.length) {
      filters.bedrooms.forEach((bedrooms) => params.append("bedrooms", bedrooms.toString()))
    }

    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice.toString())
    }

    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice.toString())
    }

    if (filters.neighborhood?.length) {
      filters.neighborhood.forEach((neighborhood) => params.append("neighborhood", neighborhood))
    }

    // Atualizar URL com os filtros
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)

    // Chamar callback se existir
    if (onFilterChange) {
      onFilterChange(filters)
    }
  }, [filters, pathname, router, onFilterChange])

  // Manipular mudanças nos filtros
  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => {
      const currentStatus = prev.status || []
      return {
        ...prev,
        status: currentStatus.includes(status) ? currentStatus.filter((s) => s !== status) : [...currentStatus, status],
      }
    })
  }, [])

  const handleBedroomsChange = useCallback((bedrooms: number) => {
    setFilters((prev) => {
      const currentBedrooms = prev.bedrooms || []
      return {
        ...prev,
        bedrooms: currentBedrooms.includes(bedrooms)
          ? currentBedrooms.filter((b) => b !== bedrooms)
          : [...currentBedrooms, bedrooms],
      }
    })
  }, [])

  const handleNeighborhoodChange = useCallback((neighborhood: string) => {
    setFilters((prev) => {
      const currentNeighborhoods = prev.neighborhood || []
      return {
        ...prev,
        neighborhood: currentNeighborhoods.includes(neighborhood)
          ? currentNeighborhoods.filter((n) => n !== neighborhood)
          : [...currentNeighborhoods, neighborhood],
      }
    })
  }, [])

  const handlePriceChange = useCallback((type: "min" | "max", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type === "min" ? "minPrice" : "maxPrice"]: value ? Number(value) : undefined,
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    router.push(pathname)
  }, [pathname, router])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>

      {/* Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Status</h4>
        <div className="space-y-2">
          {["Em lançamento", "Em construção", "Pronto para morar"].map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={filters.status?.includes(status) || false}
                onChange={() => handleStatusChange(status)}
              />
              <span className="text-sm">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quartos */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Quartos</h4>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((bedrooms) => (
            <button
              key={bedrooms}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.bedrooms?.includes(bedrooms)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
              }`}
              onClick={() => handleBedroomsChange(bedrooms)}
            >
              {bedrooms} {bedrooms === 1 ? "quarto" : "quartos"}
            </button>
          ))}
        </div>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Preço</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Mínimo</label>
            <Input
              type="number"
              placeholder="R$ Min"
              value={filters.minPrice || ""}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Máximo</label>
            <Input
              type="number"
              placeholder="R$ Max"
              value={filters.maxPrice || ""}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Bairros */}
      {neighborhoods.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Bairros</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {neighborhoods.map((neighborhood) => (
              <label key={neighborhood.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.neighborhood?.includes(neighborhood.slug) || false}
                  onChange={() => handleNeighborhoodChange(neighborhood.slug)}
                />
                <span className="text-sm">{neighborhood.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Aplicar Filtros
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}
