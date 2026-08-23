import { IBasePost, IPost } from '../../interfaces/post.interfaces';

export interface ICreatePostRES {
  success: boolean;
  message: string;
  data: ICreatePostData;
}

interface ICreatePostData {
  post: IPost;
}
