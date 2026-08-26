import { DestroyRef, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, finalize, map, Observable, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ILike } from '../interfaces/like.interface';
import { IDeletePostRES, IPost, PostPrivacy } from '../interfaces/post.interfaces';
import { PostApiService } from './post-api.service';
import { POSTS_FILTER, PostsFilter } from '../../home/interfaces/posts-filter.interface';
import { toast } from 'ngx-sonner';
import {
  ICreatePostREQ,
  ICreatePostRES,
  IPostUploading,
  IUpdatePostREQ,
} from '../create-post/interfaces/create-post.interface';
import { ProfileFacadeService } from '../../profile/services/profile-facade.service';

@Service()
export class PostFacadeService {
  private readonly postApiService = inject(PostApiService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profileFacadeService = inject(ProfileFacadeService);

  private _postsPage = signal<number>(1);
  private _hasMorePosts = signal<boolean>(true);
  private _postsState = signal<IPost[]>([]);
  private _postsCache = new Map<PostsFilter, IPost[]>();
  private _isPostLoadingState = signal<boolean>(false);
  private _isNextPostsPageLoadingState = signal<boolean>(false);
  private _activeLoadingFilterState = signal<PostsFilter | null>(null);
  private _currentFilterState = signal<PostsFilter>(POSTS_FILTER.FEED);

  public posts = this._postsState.asReadonly();
  public hasMorePosts = this._hasMorePosts.asReadonly();
  public isPostLoading = this._isPostLoadingState.asReadonly();
  public isNextPostsPageLoading = this._isNextPostsPageLoadingState.asReadonly();
  public activeLoadingFilter = this._activeLoadingFilterState.asReadonly();
  public currentFilter = this._currentFilterState.asReadonly();

  // Like
  private _postLikesLoadingState = signal<boolean>(false);
  private _postLikesState = signal<ILike[]>([]);
  private _pendingLikes = new Set<string>();

  public postLikesLoading = this._postLikesLoadingState.asReadonly();
  public postLikes = this._postLikesState.asReadonly();

  // Create Post
  private _createPostLoadingState = signal<boolean>(false);
  private _uploadingPostDataState = signal<IPostUploading | null>(null);

  public createPostLoading = this._createPostLoadingState.asReadonly();
  public uploadingPostData = this._uploadingPostDataState.asReadonly();

  // Bookmark
  private _pendingBookmarks = new Set<string>();
  private _bookmarkLoadingState = signal<boolean>(false);

  public bookmarkLoading = this._bookmarkLoadingState.asReadonly();

  // Delete
  private _deletePostLoadingState = signal<boolean>(false);

  public deletePostLoading = this._deletePostLoadingState.asReadonly();

  // Update
  private _updatePostContentLoadingState = signal<boolean>(false);
  private _updatePostPrivacyLoadingState = signal<boolean>(false);

  public updatePostContentLoading = this._updatePostContentLoadingState.asReadonly();
  public updatePostPrivacyLoading = this._updatePostPrivacyLoadingState.asReadonly();

  resetPosts(): void {
    this._postsState.set([]);
    this._postsPage.set(1);
    this._hasMorePosts.set(true);
  }

  updatePaginationState(numberOfPages: number): void {
    this._hasMorePosts.set(this._postsPage() < numberOfPages);
    if (this._hasMorePosts()) this._postsPage.update((p) => p + 1);
  }

  handleFilterChange(newFilter: PostsFilter): void {
    this.resetPosts();

    const isSameFilter = this._currentFilterState() === newFilter;
    const hasCachedData = this._postsCache.has(newFilter);

    this._currentFilterState.set(newFilter);

    if (!isSameFilter && hasCachedData) {
      this._postsState.set(this._postsCache.get(newFilter)!);
      return;
    }

    this.fetchPosts(newFilter);
  }

  fetchPosts(filter: PostsFilter): void {
    switch (filter) {
      case POSTS_FILTER.FEED:
        this.getFeedPosts();
        break;
      case POSTS_FILTER.MY_POSTS:
        const userId = this.authService.getUserId();
        if (!userId) {
          return;
        }

        this.getUserPosts(userId);
        break;
      case POSTS_FILTER.COMMUNITY:
        this.getCommunityPosts();
        break;
      case POSTS_FILTER.SAVED:
        this.getSavedPosts();
        break;
      default:
        break;
    }
  }

  getFeedPosts(limit: number = 5): void {
    if (this._activeLoadingFilterState() === POSTS_FILTER.FEED || !this._hasMorePosts()) return;

    if (this._postsPage() === 1) {
      this._isPostLoadingState.set(true);
      this._activeLoadingFilterState.set(POSTS_FILTER.FEED);
    } else {
      this._isNextPostsPageLoadingState.set(true);
    }

    this.postApiService
      .getFeedPosts(this._postsPage(), limit)
      .pipe(
        finalize(() => {
          this._activeLoadingFilterState.set(null);
          this._isPostLoadingState.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this._postsState.update((current) => [...current, ...res.data.posts]);
          this._postsCache.set(POSTS_FILTER.FEED, res.data.posts);
          this.updatePaginationState(res.meta.pagination.numberOfPages);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getCommunityPosts(limit: number = 5): void {
    if (this._activeLoadingFilterState() === POSTS_FILTER.COMMUNITY || !this._hasMorePosts())
      return;

    if (this._postsPage() === 1) {
      this._isPostLoadingState.set(true);
      this._activeLoadingFilterState.set(POSTS_FILTER.COMMUNITY);
    } else {
      this._isNextPostsPageLoadingState.set(true);
    }

    this.postApiService
      .getAllPosts(this._postsPage(), limit)
      .pipe(
        finalize(() => {
          this._activeLoadingFilterState.set(null);
          this._isPostLoadingState.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this._postsState.update((current) => [...current, ...res.data.posts]);
          this._postsCache.set(POSTS_FILTER.COMMUNITY, res.data.posts);
          this.updatePaginationState(res.meta.pagination.numberOfPages);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getSavedPosts(limit: number = 5): void {
    if (this._activeLoadingFilterState() === POSTS_FILTER.SAVED || !this._hasMorePosts()) return;

    if (this._postsPage() === 1) {
      this._isPostLoadingState.set(true);
      this._activeLoadingFilterState.set(POSTS_FILTER.SAVED);
    } else {
      this._isNextPostsPageLoadingState.set(true);
    }

    this.postApiService
      .getSavedPosts(this._postsPage(), limit)
      .pipe(
        finalize(() => {
          this._activeLoadingFilterState.set(null);
          this._isPostLoadingState.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this._postsState.update((current) => [...current, ...res.data.bookmarks]);
          this._postsCache.set(POSTS_FILTER.SAVED, res.data.bookmarks);
          this.updatePaginationState(res.meta.pagination.numberOfPages);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getUserPosts(userId: string, limit: number = 5): void {
    if (this._activeLoadingFilterState() === POSTS_FILTER.MY_POSTS || !this._hasMorePosts()) return;

    if (this._postsPage() === 1) {
      this._isPostLoadingState.set(true);
      this._activeLoadingFilterState.set(POSTS_FILTER.MY_POSTS);
    } else {
      this._isNextPostsPageLoadingState.set(true);
    }

    this.postApiService
      .getUserPosts(userId, this._postsPage(), limit)
      .pipe(
        finalize(() => {
          this._activeLoadingFilterState.set(null);
          this._isPostLoadingState.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this._postsState.set(res.data.posts);
          this._postsCache.set(POSTS_FILTER.MY_POSTS, res.data.posts);
          this.updatePaginationState(res.meta.pagination.numberOfPages);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  createPost(data: ICreatePostREQ): Observable<ICreatePostRES> {
    this._createPostLoadingState.set(true);

    const file = data.image;
    const previewUrl = file instanceof File ? URL.createObjectURL(file) : null;
    this._uploadingPostDataState.set({ body: data.body, previewUrl });

    const formData: FormData = new FormData();
    if (data.body) formData.append('body', data.body);
    if (data.image) formData.append('image', data.image);
    if (data.privacy) formData.append('privacy', data.privacy);

    return this.postApiService.createPost(formData).pipe(
      map((res) => {
        const user = this.profileFacadeService.myData()!;

        if (!user) return res;

        return {
          ...res,
          data: {
            ...res.data,
            post: {
              ...res.data.post,
              user,
            },
          },
        };
      }),
      tap({
        next: (res) => this._postsState.update((current) => [res.data.post, ...current]),
      }),
      finalize(() => {
        this._createPostLoadingState.set(false);
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        this._uploadingPostDataState.set(null);
      }),
    );
  }

  getPostLikes(postId: string): void {
    this._postLikesState.set([]);
    this._postLikesLoadingState.set(true);
    this.postApiService
      .getPostLikes(postId)
      .pipe(
        finalize(() => this._postLikesLoadingState.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this._postLikesState.set(res.data.likes);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  toggleLikePost(postId: string): void {
    if (this._pendingLikes.has(postId)) return;
    this._pendingLikes.add(postId);

    const currentUserId = this.authService.getUserId();
    if (!currentUserId) return;

    this.reverseLikeState(postId, currentUserId);

    this.postApiService
      .ToggleLikePost(postId)
      .pipe(finalize(() => this._pendingLikes.delete(postId)))
      .subscribe({
        error: () => {
          this.reverseLikeState(postId, currentUserId);
          toast.error("Couldn't like this post", {
            id: `likedpost${postId}`,
            description: 'Check your connection and try again.',
          });
        },
      });
  }

  private reverseLikeState(postId: string, userId: string): void {
    this._postsState.update((posts) =>
      posts.map((p) => {
        if (p._id !== postId) return p;

        const wasLiked = p.likes.includes(userId);
        const updatedLikes = wasLiked
          ? p.likes.filter((id) => id !== userId)
          : [...p.likes, userId];

        const updatedLikesCount = wasLiked ? p.likesCount - 1 : p.likesCount + 1;

        return { ...p, likes: updatedLikes, likesCount: updatedLikesCount };
      }),
    );
  }

  toggleSavePost(postId: string): void {
    if (this._pendingBookmarks.has(postId)) return;
    this._pendingBookmarks.add(postId);

    this._bookmarkLoadingState.set(true);

    this.reverseBookmarkState(postId);

    this.postApiService
      .toggleBookmarkPost(postId)
      .pipe(
        finalize(() => {
          this._pendingBookmarks.delete(postId);
          this._bookmarkLoadingState.set(false);
        }),
      )
      .subscribe({
        error: () => {
          this.reverseBookmarkState(postId);
          toast.error("Couldn't save this post", {
            id: `savedpost${postId}`,
            description: 'Check your connection and try again.',
          });
        },
      });
  }

  private reverseBookmarkState(postId: string): void {
    this._postsState.update((posts) =>
      posts.map((p) => {
        if (p._id !== postId) return p;

        return { ...p, bookmarked: !p.bookmarked };
      }),
    );
  }

  deletePost(postId: string): Observable<IDeletePostRES> {
    this._deletePostLoadingState.set(true);

    return this.postApiService.deletePost(postId).pipe(
      tap(() => {
        this._postsState.update((posts) => posts.filter((p) => p._id !== postId));
      }),
      finalize(() => this._deletePostLoadingState.set(false)),
    );
  }

  updatePostContent(postId: string, data: IUpdatePostREQ): Observable<ICreatePostRES> {
    this._updatePostContentLoadingState.set(true);

    const formData: FormData = new FormData();
    if (data.body) formData.append('body', data.body);
    if (data.image) formData.append('image', data.image);
    if (data.removeImage) formData.append('removeImage', String(data.removeImage));

    return this.postApiService.updatePostContent(postId, formData).pipe(
      tap((res) => {
        this._postsState.update((posts) =>
          posts.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  body: res.data.post.body,
                  image: res.data.post.image,
                }
              : p,
          ),
        );
      }),
      finalize(() => this._updatePostContentLoadingState.set(false)),
    );
  }

  private updatePrivacyState(postId: string, privacy: PostPrivacy): void {
    this._postsState.update((posts) =>
      posts.map((p) => {
        if (p._id !== postId) return p;

        return { ...p, privacy };
      }),
    );
  }

  updatePostPrivacy(postId: string, newPrivacy: PostPrivacy): void {
    const post = this._postsState().find((p) => p._id === postId);
    if (!post || post.privacy === newPrivacy) return;

    const oldPrivacy = post.privacy;
    this.updatePrivacyState(postId, newPrivacy);

    this._updatePostPrivacyLoadingState.set(true);

    const data: IUpdatePostREQ = { privacy: newPrivacy };

    this.postApiService
      .updatePostPrivacy(postId, data)
      .pipe(
        finalize(() => this._updatePostPrivacyLoadingState.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: (err) => {
          this.updatePrivacyState(postId, oldPrivacy);
          toast.error("Couldn't Update Privacy", {
            id: `editPrivacyPost${postId}`,
            description: `${err.error.message}`,
          });
        },
      });
  }
}
