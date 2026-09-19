import { IBaseRES } from '../../../core/interfaces/base-res.interface';
import { IPagination } from '../../../core/interfaces/pagination.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { IComment } from '../comment/interfaces/comment.interface';

export interface IGetPostsRES extends IBaseRES {
  data: IPostsData;
  meta: Meta;
}

export interface IGetBookmarksRES extends IBaseRES {
  data: IBookmarksData;
  meta: Meta;
}

interface ISinglePostData {
  post: IPost;
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

export interface IDeletePostRES extends IBaseRES {
  data: IDeletePostData;
}

interface IDeletePostData {
  post: IPost;
}

// Share Post
export interface ISharePostREQ {
  body?: string;
}

export interface ISharePostRES extends IBaseRES {
  data: ISinglePostData;
}
