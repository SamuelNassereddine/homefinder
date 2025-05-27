"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Neighborhood } from "@/types/database"

interface PropertyFiltersProps {
  neighborhoods: Neighborhood[]
  currentFilters: {
    bairro?: string
    quartos?: string
    status?: string
    preco_min?: string
    preco_max?: string
  }
}

export default function PropertyFilters({ neighborhoods, currentFilters }: PropertyFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>

      <div className="space-y-4">
        {/* Bairro */}
        <div>
          <Label htmlFor="bairro">Bairro</Label>
          <Select value={currentFilters.bairro || ""} onValueChange={(value) => updateFilter("bairro", value)}>
            <SelectTrigger id="bairro">
              <SelectValue placeholder="Todos os bairros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os bairros</SelectItem>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood.id} value={neighborhood.slug}>
                  {neighborhood.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quartos */}
        <div>
          <Label htmlFor="quartos">Quartos</Label>
          <Select value={currentFilters.quartos || ""} onValueChange={(value) => updateFilter("quartos", value)}>
            <SelectTrigger id="quartos">
              <SelectValue placeholder="Qualquer quantidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer quantidade</SelectItem>
              <SelectItem value="1">1 quarto</SelectItem>
              <SelectItem value="2">2 quartos</SelectItem>
              <SelectItem value="3">3 quartos</SelectItem>
              <SelectItem value="4">4+ quartos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={currentFilters.status || ""} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Em lançamento">Em lançamento</SelectItem>
              <SelectItem value="Em construção">Em construção</SelectItem>
              <SelectItem value="Pronto para morar">Pronto para morar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preço */}
        <div>
          <Label>Preço</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Input
              type="number"
              placeholder="Mínimo"
              value={currentFilters.preco_min || ""}
              onChange={(e) => updateFilter("preco_min", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máximo"
              value={currentFilters.preco_max || ""}
              onChange={(e) => updateFilter("preco_max", e.target.value)}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}
