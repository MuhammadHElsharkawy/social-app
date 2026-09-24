import { IBaseRES } from './base-res.interface';

export interface IGetUserRES extends IBaseRES {
  data: IUserData;
}

export interface IUserData {
  user: IUser;
}

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo?: string;
  cover?: string;
  followers?: string[];
  followersCount?: number;
  following?: string[];
  followingCount?: number;
  bookmarks?: string[];
  bookmarksCount?: number;
  id?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  createdAt?: Date;
  passwordChangedAt?: Date;
}

export type Gender = 'male' | 'female';

export interface IToggleFollowUserRES extends IBaseRES {
  data: IToggleFollowUserData;
}

export interface IToggleFollowUserData {
  following: boolean;
  followersCount: number;
}
