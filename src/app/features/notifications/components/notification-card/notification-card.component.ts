import { Component, input, output } from '@angular/core';
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

@Component({
  imports: [
    LucideMessageCircle,
    LucideHeart,
    LucideUserPlus,
    LucideRepeat2,
    LucideDot,
    LucideCheck,
    TimeAgoPipe,
  ],
  selector: 'app-notification-card',
  styleUrl: './notification-card.component.css',
  templateUrl: './notification-card.component.html',
})
export class NotificationCardComponent {
  notification = input.required<INotification>();

  readNotification = output<string>();

  notificationType = NotificationType;
  entityType = EntityType;

  notificationTitle = (): string => {
    switch (this.notification().type) {
      case this.notificationType.LikePost:
        return 'iked your post';
      case this.notificationType.CommentPost:
        return 'commented on your post';
      case this.notificationType.SharePost:
        return 'shared your post';
      case this.notificationType.FollowUser:
        return 'followed you';
      default:
        return '';
    }
  };

  onMarkAsRead(): void {
    this.readNotification.emit(this.notification()._id);
  }

  test() {
    // console.log(this.notification())
  }
}
