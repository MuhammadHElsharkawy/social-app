import { IUser } from '../../../core/interfaces/user.interface';
import { IPagination } from './pagination.interface';
import { IBasePost } from './post.interfaces';

export interface IGetPostLikesRES {
  success: boolean;
  message: string;
  data: IGetPostLikesData;
  meta: Meta;
}

interface IGetPostLikesData {
  likes: ILike[];
}

export interface ILike {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

interface Meta {
  pagination: IPagination;
}

export interface IToggleLikePostRES {
  success: boolean;
  message: string;
  data: IToggleLikePostData;
}

export interface IToggleLikePostData {
  liked: boolean;
  likesCount: number;
  post: ILikePost;
}

export interface ILikePost extends IBasePost {
  sharedPost: string;
}
