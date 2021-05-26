export interface Orden {
  idOrder: string;
  idCart: string;
  idUser: string;
  created_at: string | Date;
  update_at: string | Date;
  status: string;
  paymentMethod: string | null;
  shipping: number;
  discount: string;
  totalAmount: number;
  id_user_coupons: string | null;
  paymentId: string | null;
  qualified: boolean;
  numberOfOrder: number;
}

export interface OrdenProduct {
  idOrder: string;
  created_at: string | Date;
  status: string;
  paymentMethod: string;
  paymentId: string;
  product: productOrden[];
}

export interface productOrden {
  source: string;
  title: string;
}
