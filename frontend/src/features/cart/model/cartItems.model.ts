export interface CartItem{
    cart_id : number,
    item_id : number,
    name: string,
    quantity: number,
    price: string,
    image_url : string | null,
    description: string | null,
    type: string
}