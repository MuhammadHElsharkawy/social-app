import { environment } from '../../../../environments/environment.development';

const BASE_URL = environment.baseUrl;

export const SettingsEndPoints = {
  ChangePassword: `${BASE_URL}/users/change-password`,
};
