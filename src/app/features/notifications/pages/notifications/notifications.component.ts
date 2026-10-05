import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationCardComponent } from '../../components/notification-card/notification-card.component';
import { LucideCheckCheck } from '@lucide/angular';
import { NotificationsFacadeService } from '../../services/notifications-facade.service';
import { NotificationLoadingComponent } from '../../components/notification-loading/notification-loading.component';
import { NotificationsEmptyComponent } from '../../components/notifications-empty/notifications-empty.component';
import { NotificationsFilter } from '../../interfaces/notification.interface';

@Component({
  imports: [
    LucideCheckCheck,
    NotificationCardComponent,
    NotificationLoadingComponent,
    NotificationsEmptyComponent,
  ],
  selector: 'app-notifications',
  styleUrl: './notifications.component.css',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  protected readonly notificationsFacade = inject(NotificationsFacadeService);

  handleNotificationsFilter(filter: NotificationsFilter): void {
    this.notificationsFacade.notificationsFilter.set(filter);
  }

  handleReadNotification(notificationId: string): void {
    this.notificationsFacade.markNotificationAsRead(notificationId);
  }

  handleReadAll(): void {
    this.notificationsFacade.markAllAsRead();
  }

  ngOnInit(): void {
    this.notificationsFacade.getAllNotifications();
  }
}
