export interface Combo {
  idCombo: string;
  name: string;
  price: number;
  created_at: string | Date;
  discount: number;
  active: boolean | number;
  sold: number;
  available?: number;
  status?: string;
}

export interface ComboProduct {
  idComboProduct: string;
  idCombo: string;
  idProduct: string;
}
