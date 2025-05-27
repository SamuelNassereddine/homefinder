import type { AdminProperty } from "@/types/admin"

const STORAGE_KEY = "homefinder_admin_properties"

export function getStoredProperties(): AdminProperty[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Erro ao carregar propriedades:", error)
    return []
  }
}

export function saveProperty(property: AdminProperty): void {
  const properties = getStoredProperties()
  const existingIndex = properties.findIndex((p) => p.id === property.id)

  if (existingIndex >= 0) {
    properties[existingIndex] = property
  } else {
    properties.push(property)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
}

export function deleteProperty(id: string): void {
  const properties = getStoredProperties()
  const filtered = properties.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getPropertyById(id: string): AdminProperty | null {
  const properties = getStoredProperties()
  return properties.find((p) => p.id === id) || null
}

// Dados iniciais para demonstração
export function initializeDefaultProperties(): void {
  const existing = getStoredProperties()
  if (existing.length > 0) return

  const defaultProperties: AdminProperty[] = [
    {
      id: "1",
      title: "Apartamento Moderno Vila Madalena",
      price: 850000,
      description:
        "Lindo apartamento de 2 quartos com varanda gourmet e vista para a cidade. Localizado no coração da Vila Madalena.",
      address: "Rua Harmonia, 123 - Vila Madalena, São Paulo",
      type: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 75,
      images: [
        "/placeholder.svg?height=400&width=600&query=modern+apartment+living+room",
        "/placeholder.svg?height=400&width=600&query=modern+apartment+bedroom",
        "/placeholder.svg?height=400&width=600&query=modern+apartment+kitchen",
      ],
      amenities: ["piscina", "academia", "churrasqueira", "playground"],
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Casa Térrea Jardins",
      price: 1200000,
      description:
        "Casa térrea com 3 quartos, jardim amplo e garagem para 2 carros. Excelente localização nos Jardins.",
      address: "Alameda Santos, 456 - Jardins, São Paulo",
      type: "house",
      bedrooms: 3,
      bathrooms: 3,
      area: 120,
      images: [
        "/placeholder.svg?height=400&width=600&query=house+exterior+garden",
        "/placeholder.svg?height=400&width=600&query=house+living+room",
      ],
      amenities: ["jardim", "garagem", "churrasqueira"],
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProperties))
}
