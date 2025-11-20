export interface Commodity {
  id: number
  name: string
  description?: string | null
  category?: string | null
  commodity_priority?: string | null
}

export interface Location {
  id: number
  province?: string | null
  city?: string | null
  district?: string | null
  village?: string | null
}

export interface SocialForestryBusinessGroup {
  id: number
  name: string
  description?: string | null
  location?: Location | null
}

export interface Product {
  id: number
  name: string
  description?: string | null
  price: number
  unit: string
  product_usage?: string | null
  product_category?: string | null
  commodity_id?: number | null
  commodity?: Commodity | null
  commodity_priority?: string | null
  social_forestry_business_group_id?: number | null
  social_forestry_business_group?: SocialForestryBusinessGroup | null
  stock_quantity?: number | null
  minimum_order?: number | null
  images?: string[]
  value_chain?: string | null
  metadatas?: Record<string, any> | any[] | null
  created_at?: string
  updated_at?: string
}
