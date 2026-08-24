import { IPost, PostPrivacy } from '../../interfaces/post.interfaces';

export interface ICreatePostREQ {
  body?: string | null;
  image?: File | null;
  privacy?: PostPrivacy | null;
}

export interface ICreatePostRES {
  success: boolean;
  message: string;
  data: ICreatePostData;
}

interface ICreatePostData {
  post: IPost;
}

export interface IPostUploading {
  body?: string | null;
  previewUrl?: string | null;
}
