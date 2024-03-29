import { Cart } from './cart';

export interface Shipping {
  idShipping: string;
  idOrder: string;
  created_at: string | Date;
  update_at: string | Date;
  status: string;
  guide: string;
  method: 'ServiEntrega' | 'Cici' | 'Tramaco' | 'Urbano';
}

export interface ShippingCart extends Shipping {
  idCart: string;
  idCombo?: string;
}

export interface ShippingProduct extends Shipping {
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
  idCombo?: string;
  ordenado_el: string | Date;
  shipping: number;
  subTotal: number;
  discount: number;
  totalAmount: number;
  products: Cart[];
  qualified: boolean;
  numberOfOrder: number;
}
