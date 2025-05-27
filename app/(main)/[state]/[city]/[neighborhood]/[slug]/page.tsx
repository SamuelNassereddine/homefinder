import type { Metadata } from "next"
import { getPropertyBySlug } from "@/lib/services/property-service"
import PropertyClientPage from "./PropertyClientPage"

interface PropertyPageProps {
  params: {
    state: string
    city: string
    neighborhood: string
    slug: string
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.state, params.city, params.neighborhood, params.slug)

  if (!property) {
    return {
      title: "Imóvel não encontrado | HomeFinder",
      description: "O imóvel que você está procurando não foi encontrado.",
    }
  }

  return {
    title: property.seo_title || `${property.name} - ${property.neighborhood?.city?.name} | HomeFinder`,
    description:
      property.seo_description ||
      `${property.name} - ${property.status} ${property.property_type} com ${property.bedrooms} quartos em ${property.neighborhood?.name}, ${property.neighborhood?.city?.name}.`,
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  return <PropertyClientPage params={params} />
}
