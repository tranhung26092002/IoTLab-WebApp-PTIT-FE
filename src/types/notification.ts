export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  isRead: boolean;
  createdAt: string;
}