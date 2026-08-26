import { IPost, PostPrivacy } from '../../interfaces/post.interfaces';

export interface ICreatePostREQ {
  body?: string;
  image?: File;
  privacy?: PostPrivacy;
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

export interface IUpdatePostREQ extends ICreatePostREQ {
  removeImage?: boolean;
  // image?: File
  // body?: string
};
