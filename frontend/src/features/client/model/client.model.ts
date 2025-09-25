export interface ClientModel {
  client_id: number;
  document_number: string;
  email: string;
  first_name: string;
  goals: string;
  last_name: string;
  user_status: string;
}

export interface ClientResponse {
  message: string;
  client: ClientModel[];
}
