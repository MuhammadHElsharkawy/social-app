import { POSTS_FILTER, PostsFilter } from "../interfaces/posts-filter.interface";

export const isPostsFilterBtn = (value: unknown): value is PostsFilter => {
  return (
    value === POSTS_FILTER.FEED ||
    value === POSTS_FILTER.MY_POSTS ||
    value === POSTS_FILTER.COMMUNITY ||
    value === POSTS_FILTER.SAVED
  );
};
