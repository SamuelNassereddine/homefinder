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
import { X, Upload, Search } from "lucide-react"
import type { PropertyFormData, CEPResponse } from "@/types/supabase-property"
import type { State, City, Neighborhood, Amenity } from "@/types"

interface SupabasePropertyFormProps {
  propertyId?: string
}

export default function SupabasePropertyForm({ propertyId }: SupabasePropertyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCEP, setIsLoadingCEP] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Dados de localização
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])

  const [formData, setFormData] = useState<PropertyFormData>({
    // Dados básicos
    name: "",
    description: "",
    status: "Em lançamento",
    property_type: "Apartamento",

    // Localização
    cep: "",
    state_id: "",
    city_id: "",
    street: "",
    number: "",
    neighborhood_name: "",
    neighborhood_id: "",

    // Características
    bedrooms: "1",
    bathrooms: "1",
    suites: "0",
    parking_spots: "0",
    area_min: "",
    area_max: "",

    // Preços CORRIGIDOS
    price_min: "",
    price_max: "",

    // Configurações
    featured: false,

    // Relacionamentos
    amenities: [],
    images: [],
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
    if (propertyId) {
      loadPropertyData(propertyId)
    }
  }, [propertyId])

  const loadInitialData = async () => {
    try {
      const [statesRes, amenitiesRes] = await Promise.all([fetch("/api/admin/states"), fetch("/api/admin/amenities")])

      if (statesRes.ok) {
        const statesData = await statesRes.json()
        setStates(statesData)
      }

      if (amenitiesRes.ok) {
        const amenitiesData = await amenitiesRes.json()
        setAmenities(amenitiesData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error)
    }
  }

  const loadPropertyData = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${id}`)
      if (response.ok) {
        const property = await response.json()

        // Extrair dados do endereço se existir
        const addressParts = property.address?.split(", ") || []
        const street = addressParts[0] || ""
        const number = addressParts[1] || ""

        setFormData({
          name: property.name,
          description: property.description,
          status: property.status,
          property_type: property.property_type,
          cep: "", // CEP não é armazenado
          state_id: property.neighborhood?.city?.state?.id?.toString() || "",
          city_id: property.neighborhood?.city?.id?.toString() || "",
          street: street,
          number: number,
          neighborhood_name: property.neighborhood?.name || "",
          neighborhood_id: property.neighborhood_id?.toString() || "",
          bedrooms: property.bedrooms?.toString() || "1",
          bathrooms: property.bathrooms?.toString() || "1",
          suites: property.suites?.toString() || "0",
          parking_spots: property.parking_spots?.toString() || "0",
          area_min: property.area_min?.toString() || "",
          area_max: property.area_max?.toString() || "",
          price_min: property.price_min?.toString() || "",
          price_max: property.price_max?.toString() || "",
          featured: property.featured || false,
          amenities: property.amenities?.map((a: any) => a.amenity?.id || a.id) || [],
          images: [],
        })

        // Carregar cidades se estado estiver definido
        if (property.neighborhood?.city?.state?.id) {
          handleStateChange(property.neighborhood.city.state.id.toString())
        }
      }
    } catch (error) {
      console.error("Erro ao carregar propriedade:", error)
    }
  }

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStateChange = async (stateId: string) => {
    handleInputChange("state_id", stateId)
    handleInputChange("city_id", "")
    handleInputChange("neighborhood_id", "")
    setCities([])
    setNeighborhoods([])

    if (stateId) {
      try {
        const response = await fetch(`/api/admin/cities?state_id=${stateId}`)
        if (response.ok) {
          const citiesData = await response.json()
          setCities(citiesData)
        }
      } catch (error) {
        console.error("Erro ao carregar cidades:", error)
      }
    }
  }

  const handleCityChange = async (cityId: string) => {
    handleInputChange("city_id", cityId)
    handleInputChange("neighborhood_id", "")
    setNeighborhoods([])

    if (cityId) {
      try {
        const response = await fetch(`/api/admin/neighborhoods?city_id=${cityId}`)
        if (response.ok) {
          const neighborhoodsData = await response.json()
          setNeighborhoods(neighborhoodsData)
        }
      } catch (error) {
        console.error("Erro ao carregar bairros:", error)
      }
    }
  }

  // BUSCA CEP SIMPLIFICADA
  const handleCEPSearch = async () => {
    if (!formData.cep || formData.cep.length < 8) {
      alert("Digite um CEP válido")
      return
    }

    setIsLoadingCEP(true)
    try {
      const response = await fetch(`/api/admin/cep/${formData.cep}`)
      if (response.ok) {
        const cepData: CEPResponse = await response.json()

        // Buscar estado por UF
        const state = states.find((s) => s.uf === cepData.uf)
        if (state) {
          // Definir estado
          await handleStateChange(state.id.toString())

          // Aguardar um pouco para as cidades carregarem
          setTimeout(async () => {
            // Buscar cidade por nome
            const citiesResponse = await fetch(`/api/admin/cities?state_id=${state.id}`)
            if (citiesResponse.ok) {
              const citiesData = await citiesResponse.json()
              const city = citiesData.find((c: City) => c.name === cepData.localidade)

              if (city) {
                handleInputChange("city_id", city.id.toString())

                // Carregar bairros da cidade
                setTimeout(async () => {
                  await handleCityChange(city.id.toString())

                  // Aguardar bairros carregarem e tentar encontrar o bairro
                  setTimeout(() => {
                    const neighborhoodsResponse = fetch(`/api/admin/neighborhoods?city_id=${city.id}`)
                    neighborhoodsResponse.then(async (res) => {
                      if (res.ok) {
                        const neighborhoodsData = await res.json()
                        const existingNeighborhood = neighborhoodsData.find(
                          (n: Neighborhood) => n.name.toLowerCase() === cepData.bairro.toLowerCase(),
                        )

                        if (existingNeighborhood) {
                          handleInputChange("neighborhood_id", existingNeighborhood.id.toString())
                          handleInputChange("neighborhood_name", existingNeighborhood.name)
                        } else {
                          handleInputChange("neighborhood_name", cepData.bairro)
                        }
                      }
                    })
                  }, 500)
                }, 500)
              }
            }
          }, 500)
        }

        // PREENCHER CAMPOS DE ENDEREÇO
        handleInputChange("street", cepData.logradouro)
        handleInputChange("neighborhood_name", cepData.bairro)

        alert(`CEP encontrado! ${cepData.localidade}/${cepData.uf} - ${cepData.bairro}`)
      } else {
        alert("CEP não encontrado")
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      alert("Erro ao buscar CEP")
    } finally {
      setIsLoadingCEP(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    setImages((prev) => [...prev, ...newFiles])

    // Criar previews
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenityId] : prev.amenities.filter((id) => id !== amenityId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // VALIDAÇÕES
      if (!formData.name.trim()) throw new Error("Nome é obrigatório")
      if (!formData.description.trim()) throw new Error("Descrição é obrigatória")
      if (!formData.state_id) throw new Error("Estado é obrigatório")
      if (!formData.city_id) throw new Error("Cidade é obrigatória")
      if (!formData.street.trim()) throw new Error("Rua é obrigatória")
      if (!formData.neighborhood_name.trim()) throw new Error("Bairro é obrigatório")
      if (!formData.area_min || Number(formData.area_min) <= 0) throw new Error("Área mínima deve ser maior que zero")
      if (!formData.price_min || Number(formData.price_min) <= 0)
        throw new Error("Preço mínimo deve ser maior que zero")

      // Construir endereço completo
      const fullAddress = `${formData.street}${formData.number ? `, ${formData.number}` : ""}`

      // DADOS PARA ENVIO
      const propertyData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        property_type: formData.property_type,
        address: fullAddress, // Endereço completo para o banco
        neighborhood_name: formData.neighborhood_name.trim(),
        neighborhood_id: formData.neighborhood_id ? Number(formData.neighborhood_id) : null,
        city_id: Number(formData.city_id),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        suites: Number(formData.suites),
        parking_spots: Number(formData.parking_spots),
        area_min: Number(formData.area_min),
        area_max: formData.area_max ? Number(formData.area_max) : null,
        price_min: Number(formData.price_min),
        price_max: formData.price_max ? Number(formData.price_max) : null,
        featured: formData.featured,
        amenities: formData.amenities,
        images: images,
      }

      const url = propertyId ? `/api/admin/properties/${propertyId}` : "/api/admin/properties"
      const method = propertyId ? "PUT" : "POST"

      // Criar FormData para upload de imagens
      const formDataToSend = new FormData()
      formDataToSend.append("propertyData", JSON.stringify(propertyData))

      images.forEach((image, index) => {
        formDataToSend.append(`image_${index}`, image)
      })

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao salvar propriedade")
      }

      alert(propertyId ? "Propriedade atualizada com sucesso!" : "Propriedade cadastrada com sucesso!")
      router.push("/admin/properties")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert(error instanceof Error ? error.message : "Erro ao salvar propriedade")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{propertyId ? "Editar Propriedade" : "Cadastrar Nova Propriedade"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Propriedade *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Apartamento Moderno Vila Madalena"
                  required
                />
              </div>

              <div>
                <Label htmlFor="property_type">Tipo *</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value: any) => handleInputChange("property_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva a propriedade..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em lançamento">Em lançamento</SelectItem>
                  <SelectItem value="Em construção">Em construção</SelectItem>
                  <SelectItem value="Pronto para morar">Pronto para morar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* LOCALIZAÇÃO */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Localização</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    <Button type="button" variant="outline" onClick={handleCEPSearch} disabled={isLoadingCEP}>
                      {isLoadingCEP ? "..." : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Select value={formData.state_id} onValueChange={handleStateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name} ({state.uf})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Select value={formData.city_id} onValueChange={handleCityChange} disabled={!formData.state_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* CAMPOS DE ENDEREÇO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    placeholder="Nome da rua"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange("number", e.target.value)}
                    placeholder="123"
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood_name}
                    onChange={(e) => handleInputChange("neighborhood_name", e.target.value)}
                    placeholder="Nome do bairro"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Características</h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  <Label htmlFor="suites">Suítes</Label>
                  <Select value={formData.suites} onValueChange={(value) => handleInputChange("suites", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="parking_spots">Vagas</Label>
                  <Select
                    value={formData.parking_spots}
                    onValueChange={(value) => handleInputChange("parking_spots", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="area_min">Área (m²) *</Label>
                  <Input
                    id="area_min"
                    type="number"
                    value={formData.area_min}
                    onChange={(e) => handleInputChange("area_min", e.target.value)}
                    placeholder="75"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="area_max">Área Máxima (m²)</Label>
                  <Input
                    id="area_max"
                    type="number"
                    value={formData.area_max}
                    onChange={(e) => handleInputChange("area_max", e.target.value)}
                    placeholder="100"
                  />
                </div>

                {/* PREÇOS CORRIGIDOS */}
                <div>
                  <Label htmlFor="price_min">Preço Mínimo (R$) *</Label>
                  <Input
                    id="price_min"
                    type="number"
                    value={formData.price_min}
                    onChange={(e) => handleInputChange("price_min", e.target.value)}
                    placeholder="500000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price_max">Preço Máximo (R$)</Label>
                  <Input
                    id="price_max"
                    type="number"
                    value={formData.price_max}
                    onChange={(e) => handleInputChange("price_max", e.target.value)}
                    placeholder="800000"
                  />
                </div>
              </div>
            </div>

            {/* Imagens */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Imagens</h3>

              <div className="mb-4">
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

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview || "/placeholder.svg"}
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
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Comodidades</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.id}`}
                      checked={formData.amenities.includes(amenity.id)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                    />
                    <Label htmlFor={`amenity-${amenity.id}`} className="text-sm">
                      {amenity.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Configurações */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
                />
                <Label htmlFor="featured">Propriedade em destaque</Label>
              </div>
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
