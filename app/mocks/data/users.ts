import type { User } from "~/types/entities";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@pesonahub.com",
    name: "Administrator",
    phone: "0895630369226",
    role: "ADMINISTRATOR",
    thumbnail: "/images/avatars/admin.jpg",
    details: {
      province: "DKI Jakarta",
    },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    username: "partner1",
    email: "partner1@example.com",
    name: "PT Mitra Sejahtera",
    phone: "0895630369226",
    role: "PARTNER",
    thumbnail: "/images/avatars/partner1.jpg",
    details: {
      province: "Jawa Barat",
      institution_name: "PT Mitra Sejahtera",
      stakeholder_type: "COMPANY",
      contact_phone: "0895630369226",
      collaboration_commodities: {
        1: 1000, // Kopi - 1000 kg
        3: 500, // Madu - 500 kg
        5: 2000, // Kayu Jati - 2000 unit
      },
      address: "Jl. Sudirman No. 123, Bandung",
      company_description:
        "Perusahaan yang bergerak di bidang pengolahan hasil hutan",
    },
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 3,
    username: "partner2",
    email: "partner2@example.com",
    name: "CV Berkah Alam",
    phone: "083456789012",
    role: "PARTNER",
    thumbnail: "/images/avatars/partner2.jpg",
    details: {
      province: "Jawa Tengah",
      collaboration_commodities: {
        2: 800, // Kakao - 800 kg
        4: 1200, // Kemiri - 1200 kg
      },
      address: "Jl. Ahmad Yani No. 45, Semarang",
      company_description: "Pengumpul dan distributor hasil hutan non-kayu",
    },
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: 4,
    username: "partner3",
    email: "partner3@example.com",
    name: "UD Sumber Rezeki",
    phone: "084567890123",
    role: "PARTNER",
    thumbnail: null,
    details: {
      province: "Jawa Timur",
      collaboration_commodities: {
        6: 3000, // Bambu - 3000 batang
        7: 500, // Rotan - 500 kg
      },
      address: "Jl. Pahlawan No. 67, Surabaya",
    },
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: 5,
    username: "partner4",
    email: "partner4@example.com",
    name: "Koperasi Hutan Lestari",
    phone: "085678901234",
    role: "PARTNER",
    thumbnail: "/images/avatars/partner4.jpg",
    details: {
      province: "Kalimantan Barat",
      collaboration_commodities: {
        8: 1500, // Getah Jelutung - 1500 kg
        10: 2000, // Damar - 2000 kg
      },
      address: "Jl. Veteran No. 89, Pontianak",
      company_description: "Koperasi pengumpul hasil hutan getah",
    },
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

export const mockAuthTokens = {
  accessToken: "mock-access-token-abcdefghijklmnopqrstuvwxyz123456",
  refreshToken: "mock-refresh-token-zyxwvutsrqponmlkjihgfedcba654321",
  tokenType: "bearer",
};

export const mockCurrentUser = mockUsers[1]; // Default to partner1
