import { Component, inject, input, output } from '@angular/core';
import {
  LucideCheck,
  LucideDot,
  LucideHeart,
  LucideMessageCircle,
  LucideRepeat2,
  LucideUserPlus,
} from '@lucide/angular';
import {
  EntityType,
  INotification,
  NotificationType,
} from '../../interfaces/notification.interface';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { ReadMoreDirective } from '../../../../shared/directives/read-more.directive';
import { Router } from '@angular/router';

@Component({
  imports: [
    LucideMessageCircle,
    LucideHeart,
    LucideUserPlus,
    LucideRepeat2,
    LucideDot,
    LucideCheck,
    TimeAgoPipe,
    TranslatePipe,
  ],
  selector: 'app-notification-card',
  styleUrl: './notification-card.component.css',
  templateUrl: './notification-card.component.html',
})
export class NotificationCardComponent {
  readonly notification = input.required<INotification>();
  private readonly router = inject(Router);

  readonly readNotification = output<string>();

  readonly notificationType = NotificationType;
  entityType = EntityType;

  notificationTitle = (): string => {
    switch (this.notification().type) {
      case this.notificationType.LikePost:
        return 'NOTIFICATIONS.LIKE_POST';
      case this.notificationType.CommentPost:
        return 'NOTIFICATIONS.COMMENT_POST';
      case this.notificationType.SharePost:
        return 'NOTIFICATIONS.SHARE_POST';
      case this.notificationType.FollowUser:
        return 'NOTIFICATIONS.FOLLOWED';
      default:
        return '';
    }
  };

  onMarkAsRead(): void {
    this.readNotification.emit(this.notification()._id);
  }

  goToNotification(): void {
    if (this.notification().entityType === this.entityType.Post)
      this.router.navigate(['posts', this.notification().entityId]);
  }
}
