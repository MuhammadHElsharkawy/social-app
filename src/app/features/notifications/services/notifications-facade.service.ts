import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { NotificationsApiService } from './notifications-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { INotification, NotificationsFilter } from '../interfaces/notification.interface';
import { toast } from 'ngx-sonner';

@Service()
export class NotificationsFacadeService {
  private readonly NotificationsApi = inject(NotificationsApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _notificationsPage = signal<number>(1);
  private readonly _hasMore = signal<boolean>(true);
  private readonly _notificationsListState = signal<INotification[]>([]);

  readonly hasMore = this._hasMore.asReadonly();
  readonly notificationsList = this._notificationsListState.asReadonly();

  readonly notificationsFilter = signal<NotificationsFilter>('all');

  filteredNotificationsList = computed<INotification[]>(() => {
    if (this.notificationsFilter() === 'unread')
      return this._notificationsListState().filter((n) => !n.isRead);
    else return this._notificationsListState();
  });

  private _getNotificationsLoadingState = signal<boolean>(false);
  private _readAllLoadingState = signal<boolean>(false);
  private _unreadNotificationsCountState = signal<number>(0);
  private _nextPageLoadingState = signal<boolean>(false);

  public nextPageLoading = this._nextPageLoadingState.asReadonly();
  public getNotificationsLoading = this._getNotificationsLoadingState.asReadonly();
  public readAllLoading = this._readAllLoadingState.asReadonly();
  public unreadNotificationsCount = this._unreadNotificationsCountState.asReadonly();

  private updatePaginationState(numberOfPages: number): void {
    this._hasMore.set(this._notificationsPage() < numberOfPages);
    if (this._hasMore()) this._notificationsPage.update((p) => p + 1);
  }

  getAllNotifications(): void {
    if (this._getNotificationsLoadingState() || !this._hasMore()) return;

    if (this._notificationsPage() === 1) {
      this._getNotificationsLoadingState.set(true);
    } else {
      this._nextPageLoadingState.set(true);
    }

    this.NotificationsApi.getAllNotifications(this._notificationsPage())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getNotificationsLoadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this._notificationsListState.update((current) => [...current, ...res.data.notifications]);
          this.updatePaginationState(res.meta.pagination.numberOfPages);
        },
        error: (err) => {
          toast.error('Something went wrong!', { description: err.error.message });
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
