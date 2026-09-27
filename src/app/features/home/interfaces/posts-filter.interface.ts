export type PostsFilter = 'feed' | 'my-posts' | 'community' | 'saved' | 'user-posts';

export const POSTS_FILTER = {
  FEED: 'feed',
  MY_POSTS: 'my-posts',
  COMMUNITY: 'community',
  SAVED: 'saved',
  USER_POSTS: 'user-posts',
} as const satisfies Record<string, PostsFilter>;
