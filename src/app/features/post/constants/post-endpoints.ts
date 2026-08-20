import { environment } from '../../../../environments/environment.development';

const BASE_URL = environment.baseUrl;

export const PostEndPoints = {
  GetAllPosts: (page: number = 1, limit: number = 10) =>
    `${BASE_URL}/posts?page=${page}&limit=${limit}`,

  GetFeedPosts: (page: number = 1, limit: number = 10) =>
    `${BASE_URL}/posts/feed?only=following&page=${page}&limit=${limit}`,

  CreatePost: `${BASE_URL}/posts`,

  GetSinglePost: (postId: string) => `${BASE_URL}/posts/${postId}`,

  UpdatePost: (postId: string) => `${BASE_URL}/posts/${postId}`,

  DeletePost: (postId: string) => `${BASE_URL}/posts/${postId}`,

  SharePost: (postId: string) => `${BASE_URL}/posts/${postId}/share`,

  ToggleBookmarkPost: (postId: string) => `${BASE_URL}/posts/${postId}/bookmark`,

  GetPostlikes: (postId: string, page: number = 1, limit: number = 10) =>
    `${BASE_URL}/posts/${postId}/likes?page=${page}&limit=${limit}`,

  ToggleLikePost: (postId: string) => `${BASE_URL}/posts/${postId}/like`,

  GetBookmarks: (page: number = 1, limit: number = 10) =>
    `${BASE_URL}/users/bookmarks?page=${page}&limit=${limit}`,

  GetUserPosts: (userId: string, page: number = 1, limit: number = 10) =>
    `${BASE_URL}/users/${userId}/posts?page=${page}&limit=${limit}`,
};
