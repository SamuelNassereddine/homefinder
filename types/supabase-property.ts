export interface SupabaseProperty {
  id?: number
  name: string
  slug: string
  description: string
  status: "Em lançamento" | "Em construção" | "Pronto para morar"
  property_type: "Apartamento" | "Casa" | "Studio"
  address: string
  neighborhood_id: number
  bedrooms: number
  bathrooms: number
  suites: number
  parking_spots: number
  area_min: number
  area_max?: number | null
  price_min: number | null
  price_max?: number | null
  featured: boolean
  seo_title?: string | null
  seo_description?: string | null
  created_at?: string
  updated_at?: string
}

export interface PropertyFormData {
  // Dados básicos
  name: string
  description: string
  status: "Em lançamento" | "Em construção" | "Pronto para morar"
  property_type: "Apartamento" | "Casa" | "Studio"

  // Localização
  cep: string
  state_id: string
  city_id: string
  street: string
  number: string
  neighborhood_name: string
  neighborhood_id: string

  // Características
  bedrooms: string
  bathrooms: string
  suites: string
  parking_spots: string
  area_min: string
  area_max: string

  // Preços
  price_min: string
  price_max: string

  // Configurações
  featured: boolean

  // Relacionamentos
  amenities: number[]
  images: File[]
}

export interface CEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
