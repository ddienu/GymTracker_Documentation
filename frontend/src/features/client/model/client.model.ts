export interface ClientModel {
  username: string;
  password_hash: string,
  document_number: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  gender: string;
};

export interface ClientResponse{
    message:string,
    client: ClientModel
};
