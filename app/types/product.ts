import type { components } from "./pesona-hub-api";

type ProductResponse = components["schemas"]["ProductResponse"];

type ProductWithRelations = ProductResponse & {
  social_forestry_group: components["schemas"]["SocialForestryGroupResponse"];
  social_forestry_business_group: components["schemas"]["SocialForestryBusinessGroupResponse"] & {
    contact: {
      chief_contact: string;
    };
  };
};

export type { ProductWithRelations };
