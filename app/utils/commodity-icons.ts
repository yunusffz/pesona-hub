export const commodityIcons: Record<string, string> = {
  Madu: "honey",
  Rotan: "rattan",
  Bambu: "bamboo",
  Kakao: "cocoa",
  Kopi: "coffee",
  "Buah Buahan": "fruit",
  "Wisata Alam": "natural-tourism",
  Atsiri: "atsiri",
};

export const getCommodityIcon = (commodityName: string): string => {
  return commodityIcons[commodityName] || "honey";
};
