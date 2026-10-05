import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { NotificationsApiService } from './notifications-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { INotification, NotificationsFilter } from '../interfaces/notification.interface';
import { toast } from 'ngx-sonner';

@Service()
export class NotificationsFacadeService {
  private NotificationsApi = inject(NotificationsApiService);
  private destroyRef = inject(DestroyRef);

  private _notificationsListState = signal<INotification[]>([]);
  public notificationsList = this._notificationsListState.asReadonly();

  notificationsFilter = signal<NotificationsFilter>('all');

  filteredNotificationsList = computed<INotification[]>(() => {
    if (this.notificationsFilter() === 'unread')
      return this._notificationsListState().filter((n) => (!n.isRead));
    else return this._notificationsListState();
  });

  private _getNotificationsLoadingState = signal<boolean>(false);
  public getNotificationsLoading = this._getNotificationsLoadingState.asReadonly();

  private _readAllLoadingState = signal<boolean>(false);
  public readAllLoading = this._readAllLoadingState.asReadonly();

  private _unreadNotificationsCountState = signal<number>(0);
  public unreadNotificationsCount = this._unreadNotificationsCountState.asReadonly();

  getAllNotifications(): void {
    this._getNotificationsLoadingState.set(true);

    this.NotificationsApi.getAllNotifications()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getNotificationsLoadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this._notificationsListState.set(res.data.notifications);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getUnreadCount(): void {
    this.NotificationsApi.getUnreadCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this._unreadNotificationsCountState.set(res.data.unreadCount);
        },
      });
  }

  private changeNotification(notificationId: string, state: boolean): void {
    this._notificationsListState.update((current) => {
      return current.map((n) => (n._id === notificationId ? { ...n, isRead: state } : n));
    });
  }

  markNotificationAsRead(notificationId: string): void {
    const prevState: boolean = this._notificationsListState().filter(
      (n) => n._id === notificationId,
    )[0].isRead;

    this.changeNotification(notificationId, true);

    this.NotificationsApi.markNotificationAsRead(notificationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.getUnreadCount();
        },
        error: (err) => {
          this.changeNotification(notificationId, prevState);
          toast.error('Something went wrong!', { description: err.error.message });
        },
      });
  }

  private readAllNotifications(): void {
    this._notificationsListState.update((current) =>
      current.map((n) => {
        return { ...n, isRead: true };
      }),
    );
  }

  markAllAsRead(): void {
    this._readAllLoadingState.set(true);

    this.NotificationsApi.markAllAsRead()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._readAllLoadingState.set(false)),
      )
      .subscribe({
        next: () => {
          this.readAllNotifications();
          this.getUnreadCount();
        },
        error: (err) => {
          toast.error('Something went wrong!', { description: err.error.message });
        },
      });
  }
}
