import { IPagination } from '../../../core/interfaces/pagination.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { IComment } from '../comment/interfaces/comment.interface';

export interface IGetPostsRES {
  success: boolean;
  message: string;
  data: IPostsData;
  meta: Meta;
}

export interface IGetBookmarksRES {
  success: boolean;
  message: string;
  data: IBookmarksData;
  meta: Meta;
}

interface IPostsData {
  posts: IPost[];
}

interface IBookmarksData {
  bookmarks: IPost[];
}

export interface IBasePost {
  _id: string;
  id: string;
  body?: string;
  image?: string;
  privacy: PostPrivacy;
  user: IUser;
  likes: string[];
  likesCount: number;
  isShare: boolean;
  createdAt: Date;
}

export interface IPost extends IBasePost {
  sharedPost: IPost | null;
  commentsCount: number;
  topComment: IComment | null;
  sharesCount: number;
  bookmarked?: boolean;
}

export type PostPrivacy = 'following' | 'only_me' | 'public';

interface Meta {
  feedMode?: string;
  pagination: IPagination;
}

export interface IDeletePostRES {
  success: boolean;
  message: string;
  data: IDeletePostData;
}

interface IDeletePostData {
  post: IPost;
}
