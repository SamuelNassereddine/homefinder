export interface State {
  id: number
  name: string
  uf: string
  slug: string
  created_at: string
  updated_at: string
}

export interface City {
  id: number
  name: string
  slug: string
  state_id: number
  created_at: string
  updated_at: string
  state?: State
}

export interface Neighborhood {
  id: number
  name: string
  slug: string
  city_id: number
  created_at: string
  updated_at: string
  city?: City
}

export interface Property {
  id: number
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
  area_max: number | null
  price_min: number | null
  price_max: number | null
  featured: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
  neighborhood?: Neighborhood
  images?: PropertyImage[]
  amenities?: Amenity[]
  apartment_details?: ApartmentDetails
}

export interface PropertyImage {
  id: number
  property_id: number
  url: string
  alt_text: string | null
  is_main: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Amenity {
  id: number
  name: string
  icon: string | null
  created_at: string
  updated_at: string
}

export interface ApartmentDetails {
  id: number
  property_id: number
  land_size: number | null
  towers_count: number | null
  floors_count: number | null
  units_count: number | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  property_id: number | null
  message: string | null
  status: "Novo" | "Contatado" | "Convertido" | "Perdido"
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: number
  email: string
  name: string
  created_at: string
  updated_at: string
}
