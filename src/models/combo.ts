export interface Combo {
  idCombo: string;
  name: string;
  price: number;
  created_at: string | Date;
  discount: number;
  active: boolean | number;
  sold: number;
}

export interface ComboProduct {
  idComboProduct: string;
  idCombo: string;
  idProduct: string;
}
