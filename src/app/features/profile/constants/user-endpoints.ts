import { environment } from '../../../../environments/environment.development';

const BASE_URL = environment.baseUrl;

export const UserEndPoints = {
  GetMyProfile: `${BASE_URL}/users/profile-data`,

  GetUserProfile: (userId: string) => `${BASE_URL}/users/${userId}/profile`,

  ToggleFollowUser: (userId: string) => `${BASE_URL}/users/${userId}/follow`,

  UploadProfilePhoto: `${BASE_URL}/users/upload-photo`,

  UploadCoverPhoto: `${BASE_URL}/users/upload-cover`,

  DeleteProfileCover: `${BASE_URL}/users/cover`,
};
