import { IBaseRES } from '../../../../core/interfaces/base-res.interface';
import { IPagination } from '../../../../core/interfaces/pagination.interface';
import { IUser } from '../../../../core/interfaces/user.interface';

// GetPostComments
export interface IGetPostCommentsRES extends IBaseRES {
  data: GetPostCommentsData;
  meta: Meta;
}

interface Meta {
  pagination: IPagination;
}

interface GetPostCommentsData {
  comments: IComment[];
}

export interface IComment {
  _id: string;
  content?: string;
  image?: string;
  commentCreator: IUser;
  post: string;
  parentComment: null | string;
  likes: string[];
  createdAt: string;
  repliesCount: number;
}

// GetCommentReplies
export interface IGetCommentRepliesRES extends IBaseRES {
  data: GetCommentRepliesData;
  meta: Meta;
}

interface GetCommentRepliesData {
  replies: IReply[];
}

export interface IReply extends IComment {
  isReply: boolean;
}

// ToggleLikeComment
export interface IToggleLikeCommentRES extends IBaseRES {
  data: ToggleLikeCommentData;
}

interface ToggleLikeCommentData {
  liked: boolean;
  likesCount: number;
  comment: IComment;
}

// Create Comment
export interface ICreateCommentREQ {
  content?: string;
  image?: File;
}

export interface ICreateCommentRES extends IBaseRES {
  data: CreateCommentData;
}

interface CreateCommentData {
  comment: IComment;
}

// DeleteComment
export interface IDeleteCommentRES extends IBaseRES {
  data: DeleteCommentData;
}

interface DeleteCommentData {}

// Create Reply
export interface ICreateReplyRES extends IBaseRES {
  data: CreateReplyData;
}

interface CreateReplyData {
  reply: IReply;
}
