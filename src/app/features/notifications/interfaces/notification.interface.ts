import { IBaseRES } from '../../../core/interfaces/base-res.interface';
import { IPagination } from '../../../core/interfaces/pagination.interface';

//
export interface IGetNotificationsRES extends IBaseRES {
  data: Data;
  meta: Meta;
}

export interface Data {
  notifications: INotification[];
}

export interface INotification {
  _id: string;
  recipient: IActor;
  actor: IActor;
  type: NotificationType;
  entity: IEntity;
  entityType: EntityType;
  entityId: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface IActor {
  _id: string;
  name: string;
  photo: string;
  username?: string;
}

export interface IEntity {
  _id: string;
  body?: string;
  image?: string;
  user?: string;
  commentsCount?: number;
  topComment?: TopComment | null;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
  id?: string;
  unavailable?: boolean;
  name?: string;
  username?: string;
  photo?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: IActor;
  post: string;
  parentComment: null;
  likes: unknown[];
  createdAt: Date;
}

export enum EntityType {
  Post = 'post',
  User = 'user',
}

export enum NotificationType {
  LikePost = 'like_post',
  CommentPost = 'comment_post',
  SharePost = 'share_post',
  FollowUser = 'follow_user',
}

export interface Meta {
  feedMode: string;
  pagination: IPagination;
}

//
export interface IGetUnreadCountRES extends IBaseRES {
  data: IGetUnreadCountData;
}

export interface IGetUnreadCountData {
  unreadCount: number;
}

//
export interface IMarkNotificationAsReadRES extends IBaseRES {
  data: IMarkNotificationAsReadData;
}

export interface IMarkNotificationAsReadData {
  notification: INotification;
}

//
export interface IMarkAllAsReadRES extends IBaseRES {
  data: IMarkAllAsReadData;
}

export interface IMarkAllAsReadData {
  modifiedCount: number;
}

//
export type NotificationsFilter = 'all' | 'unread';
