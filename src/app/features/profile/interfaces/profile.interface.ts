import { IBaseRES } from '../../../core/interfaces/base-res.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { PostPrivacy } from '../../post/interfaces/post.interfaces';

export interface IGetMyProfileRES extends IBaseRES {
  data: IMyProfileData;
}

export interface IMyProfileData {
  user: IUser;
}

export interface IGetUserProfileRES extends IBaseRES {
  data: IUserProfileData;
}

export interface IUserProfileData {
  user: IUser;
  isFollowing: boolean;
}

export interface IProfileView {
  user: IUser;
  isFollowing: boolean;
  isMyProfile: boolean;
}

export interface IUpdateProfilePictureData {
  picture: File;
  privacy: PostPrivacy;
}
