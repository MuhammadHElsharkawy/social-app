import { IUser } from '../../../core/interfaces/user.interface';

export interface IGetMyProfile {
  success: boolean;
  message: string;
  data: GetMyProfileData;
}

interface GetMyProfileData {
  user: IUser;
}
