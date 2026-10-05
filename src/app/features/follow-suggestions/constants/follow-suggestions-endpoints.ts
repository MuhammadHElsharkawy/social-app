import { environment } from '../../../../environments/environment.development';

const BASE_URL = environment.baseUrl;

export const FollowSuggestionsEndPoints = {
  GetFollowSuggestions: (page: number = 1, limit: number = 20) =>
    `${BASE_URL}/users/suggestions?limit=${limit}&page=${page}`,
};
