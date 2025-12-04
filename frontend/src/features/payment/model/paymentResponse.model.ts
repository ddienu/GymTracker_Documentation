export interface PaymentOrderResponse {
  payment_id: number;
  client_order_id: number;
  payment_method_id: number;
  payment_date: string;
  amount: string; 
  transaction_id: string | null;
  payment_status: string;
  
  client_id: number;
  order_date: string;
  order_status: string;
  total_amount: string;
  shipping_address: string | null;

  name: string;
}
