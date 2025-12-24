export interface ProfessionalAppointment{
  appointment_id: number;
  assigned_professional_id: number | null;

  // Datos del cliente/perfil
  client_id: number;
  profile_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  document_number: string | null;
  gender: string | null;
  birth_date: string | null;           
  photo_url: string | null;
  registration_date: string | null;

  // Datos de salud/fitness
  height_cm: number | null;
  weight_kg: number | null;
  medical_conditions: string | null;
  experience_level: string | null;
  goals: string | null;
  emergency_contact: string | null;

  // Datos de la cita
  professional_id: number;
  service_id: number;
  start_time: string;                   
  end_time: string;                     
  status: string;
  booked_by: string;
  notes: string | null;

  // Cancelación
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancel_reason: string | null;

  // Auditoría
  created_at: string;
  updated_at: string;
};