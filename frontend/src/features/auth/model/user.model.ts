export interface UserModel {
  username: string;
  password_hash: string;
  birth_date: string;         
  client_id: number;
  goals: string | null;
  document_number: string;
  first_name: string;
  last_name: string;
  email: string;
  user_status: string; 
  registration_date: string;
  gender: string;
}

export interface UserResponse {
    message: string,
    client: UserModel
}
