import { environment } from "../../../../environments/environment.development";

const BASE_URL = environment.baseUrl;

export const authEndPoints = {
  LOGIN: `${BASE_URL}/users/signin`,
  REGISTER: `${BASE_URL}/users/signup`,
};
