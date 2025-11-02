import type { components } from "./pesona-hub-api";

type ProductResponse = components["schemas"]["ProductResponse"];

type Commodity = {
  id: number;
  name: string;
  description?: string | null;
  category?: string | null;
};

type SocialForestryBusinessGroupWithRelations = components["schemas"]["SocialForestryBusinessGroupResponse"] & {
  contact?: {
    chief_contact: string;
  };
  location?: components["schemas"]["LocationResponse"] | null;
};

type ProductWithRelations = ProductResponse & {
  commodity?: Commodity | null;
  social_forestry_group?: components["schemas"]["SocialForestryGroupResponse"] | null;
  social_forestry_business_group?: SocialForestryBusinessGroupWithRelations | null;
};

export type { ProductWithRelations };
