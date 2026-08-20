export type PostsFilter = 'feed' | 'my-posts' | 'community' | 'saved';

export const POSTS_FILTER = {
  FEED: 'feed',
  MY_POSTS: 'my-posts',
  COMMUNITY: 'community',
  SAVED: 'saved',
} as const satisfies Record<string, PostsFilter>;
