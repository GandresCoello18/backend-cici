export interface Lottery {
  idLottery: string;
  idCart: string;
  created_at: string | Date;
  finish_at?: string | null;
  winnerUser: string | null;
  status: 'Pending' | 'Complete';
  numberOfLottery: number;
}
