export interface OrderItemDetail {
  client_order_id: number;
  client_id: number;
  document_number: string,
  email: string,
  order_date: string; 
  order_status: string;

  total_amount: string;
  shipping_address: string | null;

  order_item_id: number;
  item_type: "SERVICE" | "PRODUCT" | string;
  item_id: number;

  quantity: number;
  unit_price: string; 

  product_name: string | null;
  product_description: string | null;

  service_name: string | null;
  service_description: string | null;
}
