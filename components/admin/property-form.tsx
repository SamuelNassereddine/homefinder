"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Upload } from "lucide-react"
import type { AdminProperty, PropertyFormData } from "@/types/admin"
import { saveProperty, getPropertyById } from "@/lib/admin-storage"

interface PropertyFormProps {
  propertyId?: string
}

const AMENITIES_OPTIONS = [
  "piscina",
  "academia",
  "churrasqueira",
  "playground",
  "salao-festas",
  "quadra-esportes",
  "pet-friendly",
  "portaria-24h",
  "elevador",
  "jardim",
  "garagem",
  "varanda-gourmet",
]

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    price: "",
    description: "",
    address: "",
    type: "apartment",
    bedrooms: "1",
    bathrooms: "1",
    area: "",
    featured: false,
    amenities: [],
  })

  // Carregar dados se for edição
  useEffect(() => {
    if (propertyId) {
      const property = getPropertyById(propertyId)
      if (property) {
        setFormData({
          title: property.title,
          price: property.price.toString(),
          description: property.description,
          address: property.address,
          type: property.type,
          bedrooms: property.bedrooms.toString(),
          bathrooms: property.bathrooms.toString(),
          area: property.area.toString(),
          featured: property.featured,
          amenities: property.amenities,
        })
        setImages(property.images)
      }
    }
  }, [propertyId])

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validação
      if (!formData.title.trim()) throw new Error("Título é obrigatório")
      if (!formData.price || Number(formData.price) <= 0) throw new Error("Preço deve ser maior que zero")
      if (!formData.description.trim()) throw new Error("Descrição é obrigatória")
      if (!formData.address.trim()) throw new Error("Endereço é obrigatório")
      if (!formData.area || Number(formData.area) <= 0) throw new Error("Área deve ser maior que zero")

      const property: AdminProperty = {
        id: propertyId || Date.now().toString(),
        title: formData.title.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        address: formData.address.trim(),
        type: formData.type,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images,
        amenities: formData.amenities,
        featured: formData.featured,
        createdAt: propertyId
          ? getPropertyById(propertyId)?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      saveProperty(property)

      // Feedback de sucesso
      alert(propertyId ? "Imóvel atualizado com sucesso!" : "Imóvel cadastrado com sucesso!")
      router.push("/admin/properties")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao salvar imóvel")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{propertyId ? "Editar Imóvel" : "Cadastrar Novo Imóvel"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ex: Apartamento Moderno Vila Madalena"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="850000"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva o imóvel..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, número - Bairro, Cidade"
                required
              />
            </div>

            {/* Características */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value: any) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area">Área (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="75"
                  required
                />
              </div>
            </div>

            {/* Imagens */}
            <div>
              <Label>Imagens</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para upload</span> ou arraste imagens
                    </p>
                  </div>
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              {/* Preview das imagens */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comodidades */}
            <div>
              <Label>Comodidades</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity} className="text-sm capitalize">
                      {amenity.replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Destaque */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
              />
              <Label htmlFor="featured">Imóvel em destaque</Label>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/properties")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : propertyId ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
