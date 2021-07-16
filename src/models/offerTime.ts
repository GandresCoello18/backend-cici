export interface OfferTime {
  idOfferTime: string;
  created_at: string | Date;
  finish_at: string | Date;
  description: string;
  status_offer_time: 'active' | 'disable';
}

export interface OfferTimeProducts {
  id_offerTime_product: string;
  idProduct: string;
  idOfferTime: string;
}
