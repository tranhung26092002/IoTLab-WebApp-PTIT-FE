export interface Notification {
  id: number;
  userId: number;
  borrowRecordId: number;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}