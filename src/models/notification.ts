export interface Notification {
  idNotification: string;
  idUser: string;
  created_at: string | Date;
  link: string;
  title: string;
  text: string;
  isRead: boolean | number;
}
