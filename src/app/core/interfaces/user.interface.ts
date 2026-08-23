export interface IUser {
  _id: string;
  name: string;
  username?: string;
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
