export interface User {
  idUser: string;
  userName: string;
  email: string;
  password: string | null;
  created_at: Date | string;
  isAdmin: boolean;
  avatar: string | null;
  provider: string;
  phone: number | null;
  isBanner: boolean;
  ciciRank: number;
}
