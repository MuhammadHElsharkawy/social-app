import { IUser } from '../../../core/interfaces/user.interface';

export interface ITopComment {
  _id: string;
  content: string;
  commentCreator: IUser;
  post: string;
  parentComment: null;
  likes: unknown[];
  createdAt: Date;
  image?: string;
}
