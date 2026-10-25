import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsEndPoints } from '../constants/notification-endpoints';
import {
  IGetNotificationsRES,
  IGetUnreadCountRES,
  IMarkAllAsReadRES,
  IMarkNotificationAsReadRES,
} from '../interfaces/notification.interface';

@Service()
export class NotificationsApiService {
  private readonly httpClient = inject(HttpClient);

  getAllNotifications(page: number = 1, limit: number = 20): Observable<IGetNotificationsRES> {
    return this.httpClient.get<IGetNotificationsRES>(
      NotificationsEndPoints.GetNotifications(page, limit),
    );
  }

  getUnreadCount(): Observable<IGetUnreadCountRES> {
    return this.httpClient.get<IGetUnreadCountRES>(NotificationsEndPoints.GetUnreadCount);
  }

  markNotificationAsRead(notificationId: string): Observable<IMarkNotificationAsReadRES> {
    return this.httpClient.patch<IMarkNotificationAsReadRES>(
      NotificationsEndPoints.MarkNotificationAsRead(notificationId),
      {},
    );
  }

  markAllAsRead(): Observable<IMarkAllAsReadRES> {
    return this.httpClient.patch<IMarkAllAsReadRES>(NotificationsEndPoints.MarkAllAsRead, {});
  }
}
