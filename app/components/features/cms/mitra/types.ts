export interface ProfileFormData {
  thumbnail: string | null;
  picName: string;
  picEmail: string;
  picWhatsapp: string;
  companyName: string;
  partnerLevel: string;
  whatsappNumber: string;
  websiteUrl: string;
  commodities: (string | number)[];
  collaborationType: string[];
  additionalInfo: string;
}

export interface AccountFormData {
  username: string;
  password: string;
  confirmPassword: string;
}
