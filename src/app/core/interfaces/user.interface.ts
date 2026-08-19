export interface IUser {
  _id: string;
  name: string;
  username?: string;
  email: string;
  photo?: string;
  cover?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  id?: string
}
