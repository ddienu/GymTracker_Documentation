export type SpecialtyType = 'TRAINING' | 'NUTRITION' | 'PHYSIOTHERAPY';

export interface Professional {
  professional_id: number;
  profile_id: number;
  specialty: SpecialtyType;
  certifications: string;
  years_of_experience: number;
  hourly_rate: string;
  is_available: number;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string | null;
}
