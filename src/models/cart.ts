export interface Cart {
  idCart: string;
  created_at: Date | string;
  status: string;
  idUser: string;
}

export interface CartProduct {
  id_cart_product: string;
  idProduct: string;
  quantity: number;
  idCart: string;
  colour: string;
}

export interface ProductCart {
  idProducts: string;
  title: string;
  source: string;
  price: number;
  quantity: number;
  colour: string;
}
