import { environment } from '../../../../environments/environment.development';

const BASE_URL = environment.baseUrl;

export const UserEndPoints = {
  GetMyProfile: `${BASE_URL}/users/profile-data`,

  GetUserProfile: (userId: string) => `${BASE_URL}/users/${userId}/profile`,
};
