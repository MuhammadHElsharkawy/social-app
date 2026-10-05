import { environment } from '../../../../environments/environment.development';

const BASE_URL = environment.baseUrl;

export const NotificationsEndPoints = {
  GetNotifications: (page: number = 1, limit: number = 20) =>
    `${BASE_URL}/notifications?page=${page}&limit=${limit}`,

  GetUnreadCount: `${BASE_URL}/notifications/unread-count`,

  MarkNotificationAsRead: (notificationId: string) =>
    `${BASE_URL}/notifications/${notificationId}/read`,

  MarkAllAsRead: `${BASE_URL}/notifications/read-all`,
};
