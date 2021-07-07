export interface Lottery {
  idLottery: string;
  idCart: string;
  created_at: string | Date;
  winnerUser: string | null;
  status: 'Pending' | 'Complete';
}
