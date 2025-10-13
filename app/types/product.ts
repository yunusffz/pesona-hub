interface Product {
  image: string;
  title: string;
  description: string;
  price: string;
  contact: string;
  catalogType: string;
  kps: string;
  kups: string;
  size?: string;
  isNew?: boolean;
  productType?: string;
  link: string;
}

export type { Product };
