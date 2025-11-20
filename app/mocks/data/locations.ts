import type { Location } from '~/types/entities'

export const mockLocations: Location[] = [
  // Jawa Barat
  { id: 1, province: 'Jawa Barat', district: 'Bandung', sub_district: 'Cidadap', village: 'Hegarmanah' },
  { id: 2, province: 'Jawa Barat', district: 'Bandung', sub_district: 'Cibeunying Kaler', village: 'Cigadung' },
  { id: 3, province: 'Jawa Barat', district: 'Bogor', sub_district: 'Ciawi', village: 'Bendungan' },
  { id: 4, province: 'Jawa Barat', district: 'Sukabumi', sub_district: 'Cibadak', village: 'Cibadak' },
  { id: 5, province: 'Jawa Barat', district: 'Garut', sub_district: 'Tarogong Kidul', village: 'Jayaraga' },

  // Jawa Tengah
  { id: 6, province: 'Jawa Tengah', district: 'Semarang', sub_district: 'Banyumanik', village: 'Gedawang' },
  { id: 7, province: 'Jawa Tengah', district: 'Semarang', sub_district: 'Candisari', village: 'Jatingaleh' },
  { id: 8, province: 'Jawa Tengah', district: 'Magelang', sub_district: 'Borobudur', village: 'Wanurejo' },
  { id: 9, province: 'Jawa Tengah', district: 'Solo', sub_district: 'Laweyan', village: 'Panularan' },
  { id: 10, province: 'Jawa Tengah', district: 'Tegal', sub_district: 'Slawi', village: 'Kalisapu' },

  // Jawa Timur
  { id: 11, province: 'Jawa Timur', district: 'Surabaya', sub_district: 'Gubeng', village: 'Airlangga' },
  { id: 12, province: 'Jawa Timur', district: 'Malang', sub_district: 'Lowokwaru', village: 'Tunggulwulung' },
  { id: 13, province: 'Jawa Timur', district: 'Kediri', sub_district: 'Gurah', village: 'Gurah' },
  { id: 14, province: 'Jawa Timur', district: 'Jember', sub_district: 'Tanggul', village: 'Mangli' },
  { id: 15, province: 'Jawa Timur', district: 'Banyuwangi', sub_district: 'Giri', village: 'Giri' },

  // Kalimantan Barat
  { id: 16, province: 'Kalimantan Barat', district: 'Pontianak', sub_district: 'Pontianak Kota', village: 'Darat Sekip' },
  { id: 17, province: 'Kalimantan Barat', district: 'Sambas', sub_district: 'Sambas', village: 'Durian' },
  { id: 18, province: 'Kalimantan Barat', district: 'Sanggau', sub_district: 'Sanggau Kapuas', village: 'Pasar Hilir' },
  { id: 19, province: 'Kalimantan Barat', district: 'Sintang', sub_district: 'Sintang', village: 'Tanjung Puri' },
  { id: 20, province: 'Kalimantan Barat', district: 'Ketapang', sub_district: 'Delta Pawan', village: 'Muara Pawan' },

  // Kalimantan Tengah
  { id: 21, province: 'Kalimantan Tengah', district: 'Palangka Raya', sub_district: 'Jekan Raya', village: 'Petuk Katimpun' },
  { id: 22, province: 'Kalimantan Tengah', district: 'Kotawaringin Timur', sub_district: 'Mentaya Hilir Selatan', village: 'Bagendang Hilir' },
  { id: 23, province: 'Kalimantan Tengah', district: 'Kapuas', sub_district: 'Selat', village: 'Tamban' },

  // Kalimantan Timur
  { id: 24, province: 'Kalimantan Timur', district: 'Samarinda', sub_district: 'Samarinda Ulu', village: 'Air Hitam' },
  { id: 25, province: 'Kalimantan Timur', district: 'Balikpapan', sub_district: 'Balikpapan Tengah', village: 'Karang Jati' },
  { id: 26, province: 'Kalimantan Timur', district: 'Kutai Kartanegara', sub_district: 'Tenggarong', village: 'Panji' },

  // Sulawesi Selatan
  { id: 27, province: 'Sulawesi Selatan', district: 'Makassar', sub_district: 'Tamalate', village: 'Balang Baru' },
  { id: 28, province: 'Sulawesi Selatan', district: 'Gowa', sub_district: 'Somba Opu', village: 'Sungguminasa' },
  { id: 29, province: 'Sulawesi Selatan', district: 'Maros', sub_district: 'Maros Baru', village: 'Baji Pamai' },
  { id: 30, province: 'Sulawesi Selatan', district: 'Bone', sub_district: 'Tanete Riattang', village: 'Watampone' },

  // Sumatera Utara
  { id: 31, province: 'Sumatera Utara', district: 'Medan', sub_district: 'Medan Baru', village: 'Babura' },
  { id: 32, province: 'Sumatera Utara', district: 'Deli Serdang', sub_district: 'Lubuk Pakam', village: 'Lubuk Pakam Pekan' },
  { id: 33, province: 'Sumatera Utara', district: 'Toba Samosir', sub_district: 'Balige', village: 'Soposurung' },

  // Sumatera Barat
  { id: 34, province: 'Sumatera Barat', district: 'Padang', sub_district: 'Padang Utara', village: 'Air Tawar Barat' },
  { id: 35, province: 'Sumatera Barat', district: 'Bukittinggi', sub_district: 'Mandiangin Koto Selayan', village: 'Puhun Pintu Kabun' },
  { id: 36, province: 'Sumatera Barat', district: 'Agam', sub_district: 'Lubuk Basung', village: 'Lubuk Basung' },

  // Lampung
  { id: 37, province: 'Lampung', district: 'Bandar Lampung', sub_district: 'Telukbetung Utara', village: 'Gunung Mas' },
  { id: 38, province: 'Lampung', district: 'Lampung Selatan', sub_district: 'Kalianda', village: 'Kalianda' },
  { id: 39, province: 'Lampung', district: 'Lampung Tengah', sub_district: 'Gunung Sugih', village: 'Gunung Sugih' },

  // Nusa Tenggara Barat
  { id: 40, province: 'Nusa Tenggara Barat', district: 'Mataram', sub_district: 'Cakranegara', village: 'Sayang-Sayang' },
  { id: 41, province: 'Nusa Tenggara Barat', district: 'Lombok Barat', sub_district: 'Gerung', village: 'Gerung Utara' },
  { id: 42, province: 'Nusa Tenggara Barat', district: 'Sumbawa', sub_district: 'Sumbawa', village: 'Seketeng' },
]
