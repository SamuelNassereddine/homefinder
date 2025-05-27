export interface AdminProperty {
  id: string
  title: string
  price: number
  description: string
  address: string
  type: "apartment" | "house" | "studio"
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  amenities: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface PropertyFormData {
  title: string
  price: string
  description: string
  address: string
  type: "apartment" | "house" | "studio"
  bedrooms: string
  bathrooms: string
  area: string
  featured: boolean
  amenities: string[]
}
