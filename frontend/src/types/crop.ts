export interface Crop {
  id: number;
  name: string;
  description: string;
  image: string;
  is_active: boolean;
  created_at: string;
  crop_type: "kharif" | "rabi" | "zaid";
}
