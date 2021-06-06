import { Cart } from './cart';

export interface Shipping {
  idShipping: string;
  idOrder: string;
  created_at: string | Date;
  update_at: string | Date;
  status: string;
  guide: string;
  method: string;
}

export interface ShippingCart {
  idShipping: string;
  idOrder: string;
  created_at: string | Date;
  update_at: string | Date;
  status: string;
  guide: string;
  method: string;
  idCart: string;
}

export interface ShippingProduct {
  idShipping: string;
  idOrder: string;
  created_at: string | Date;
  update_at: string | Date;
  status: string;
  guide: string;
  method: string;
  title: string;
  sources: string;
}

export interface DetailsOrdenAndShipping {
  idShipping: string;
  enviado_el: string | Date;
  entregado_el: string | Date;
  status: string;
  guide: string;
  method: string;
  idCart: string;
  ordenado_el: string | Date;
  shipping: number;
  subTotal: number;
  discount: number;
  totalAmount: number;
  products: Cart[];
  qualified: boolean;
  numberOfOrder: number;
}
