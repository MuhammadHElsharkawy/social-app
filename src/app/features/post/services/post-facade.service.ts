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
import { IComment, ICreateCommentREQ, IReply } from '../comment/interfaces/comment.interface';

@Service()
export class PostFacadeService {
  private readonly postApiService = inject(PostApiService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profileFacadeService = inject(ProfileFacadeService);

  private _postsPage = signal<number>(1);

  private _hasMorePosts = signal<boolean>(true);
  public hasMorePosts = this._hasMorePosts.asReadonly();

  private _postsState = signal<IPost[]>([]);
  public posts = this._postsState.asReadonly();

  private _postsCache = new Map<PostsFilter, IPost[]>();

  private _isPostLoadingState = signal<boolean>(false);
  public isPostLoading = this._isPostLoadingState.asReadonly();

  private _isNextPostsPageLoadingState = signal<boolean>(false);
  public isNextPostsPageLoading = this._isNextPostsPageLoadingState.asReadonly();

  private _activeLoadingFilterState = signal<PostsFilter | null>(null);
  public activeLoadingFilter = this._activeLoadingFilterState.asReadonly();

  private _currentFilterState = signal<PostsFilter>(POSTS_FILTER.FEED);
  public currentFilter = this._currentFilterState.asReadonly();

  resetPosts(): void {
    this._postsState.set([]);
    this._postsPage.set(1);
    this._hasMorePosts.set(true);
  }

  updatePostsPaginationState(numberOfPages: number): void {
    this._hasMorePosts.set(this._postsPage() < numberOfPages);
    if (this._hasMorePosts()) this._postsPage.update((p) => p + 1);
  }

  handleFilterChange(newFilter: PostsFilter): void {
    const isSameFilter = this._currentFilterState() === newFilter;
    const hasCachedData = this._postsCache.has(newFilter);

    this._currentFilterState.set(newFilter);

    if (!isSameFilter && hasCachedData) {
      this._postsState.set(this._postsCache.get(newFilter)!);
      return;
    }

    this.resetPosts();

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
          this._postsCache.set(POSTS_FILTER.FEED, this._postsState());
          this.updatePostsPaginationState(res.meta.pagination.numberOfPages);
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
          this.updatePostsPaginationState(res.meta.pagination.numberOfPages);
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
          this.updatePostsPaginationState(res.meta.pagination.numberOfPages);
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
          this.updatePostsPaginationState(res.meta.pagination.numberOfPages);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // Create Post
  private _createPostLoadingState = signal<boolean>(false);
  public createPostLoading = this._createPostLoadingState.asReadonly();

  private _uploadingPostDataState = signal<IPostUploading | null>(null);
  public uploadingPostData = this._uploadingPostDataState.asReadonly();

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

  // Like
  private _postLikesLoadingState = signal<boolean>(false);
  public postLikesLoading = this._postLikesLoadingState.asReadonly();

  private _postLikesState = signal<ILike[]>([]);
  public postLikes = this._postLikesState.asReadonly();

  private _pendingLikes = new Set<string>();

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

  // Bookmark
  private _pendingBookmarks = new Set<string>();
  private _bookmarkLoadingState = signal<boolean>(false);

  public bookmarkLoading = this._bookmarkLoadingState.asReadonly();

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

  // Delete
  private _deletePostLoadingState = signal<boolean>(false);
  public deletePostLoading = this._deletePostLoadingState.asReadonly();

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

  // Update
  private _updatePostContentLoadingState = signal<boolean>(false);
  public updatePostContentLoading = this._updatePostContentLoadingState.asReadonly();

  private _updatePostPrivacyLoadingState = signal<boolean>(false);
  public updatePostPrivacyLoading = this._updatePostPrivacyLoadingState.asReadonly();

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

  // Post Comments
  private _commentsPage = signal<number>(1);

  private _hasMoreComments = signal<boolean>(true);
  public hasMoreComments = this._hasMoreComments.asReadonly();

  private _postCommentsState = signal<Map<string, IComment[]>>(new Map());
  public postComments = this._postCommentsState.asReadonly();

  private _commentRepliesState = signal<Map<string, IReply[]>>(new Map());
  public commentReplies = this._commentRepliesState.asReadonly();

  private _getPostCommentsLoadingState = signal<string | null>(null);
  public getPostCommentsLoading = this._getPostCommentsLoadingState.asReadonly();

  private _getCommentRepliesLoadingState = signal<string | null>(null);
  public getCommentRepliesLoading = this._getCommentRepliesLoadingState.asReadonly();

  private _toggleLikeCommentLoadingState = signal<string | null>(null);
  public toggleLikeCommentLoading = this._toggleLikeCommentLoadingState.asReadonly();

  private _createCommentLoadingState = signal<boolean>(false);
  public createCommentLoading = this._createCommentLoadingState.asReadonly();

  private _uploadingCommentState = signal<IComment | null>(null);
  public uploadingComment = this._uploadingCommentState.asReadonly();

  private _deleteCommentLoadingState = signal<boolean>(false);
  public deleteCommentLoading = this._deleteCommentLoadingState.asReadonly();

  updateCommentsPaginationState(): void {}

  private addComment(postId: string, comment: IComment): void {
    this._postCommentsState.update((current) => {
      const newMap = new Map(current);
      const existingComments = newMap.get(postId) ?? [];

      newMap.set(postId, [comment, ...existingComments]);
      return newMap;
    });
  }

  private addReply(commentId: string, reply: IReply): void {
    this._commentRepliesState.update((current) => {
      const newMap = new Map(current);
      const existingReplies = newMap.get(commentId) ?? [];

      newMap.set(commentId, [...existingReplies, reply]);
      return newMap;
    });
  }

  private updatePostCommentsCount(postId: string, count: 1 | -1): void {
    this._postsState.update((current) => {
      return current.map((p) =>
        p._id === postId ? { ...p, commentsCount: p.commentsCount + count } : p,
      );
    });
  }

  private updateCommentRepliesCount(postId: string, commentId: string, count: 1 | -1): void {
    this._postCommentsState.update((current) => {
      const newMap = new Map(current);
      const existingComments = newMap.get(postId) ?? [];

      const updatedComments = existingComments.map((c) =>
        c._id === commentId ? { ...c, repliesCount: c.repliesCount + count } : c,
      );

      newMap.set(postId, updatedComments);
      return newMap;
    });
  }

  private removeComment(postId: string, commentId: string): void {
    this._postCommentsState.update((current) => {
      const newMap = new Map(current);
      const existingComments = newMap.get(postId);

      if (!existingComments) return newMap;

      newMap.set(
        postId,
        existingComments.filter((c) => c._id !== commentId),
      );
      return newMap;
    });
  }

  private removeReply(commentId: string, replyId: string): void {
    this._commentRepliesState.update((current) => {
      const newMap = new Map(current);
      const existingReplies = newMap.get(commentId);

      if (!existingReplies) return newMap;

      newMap.set(
        commentId,
        existingReplies.filter((r) => r._id !== replyId),
      );
      return newMap;
    });
  }

  getPostComments(postId: string, limit: number = 5): void {
    this._getPostCommentsLoadingState.set(postId);

    this.postApiService
      .getPostComments(postId, 1, limit)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getPostCommentsLoadingState.set(null)),
      )
      .subscribe({
        next: (res) => {
          this._postCommentsState.update((current) => {
            const newMap = new Map(current);
            newMap.set(postId, res.data.comments);
            return newMap;
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getCommentReplies(postId: string, commentId: string, limit: number = 5): void {
    this._getCommentRepliesLoadingState.set(commentId);

    this.postApiService
      .getCommentReplies(postId, commentId, 1, limit)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getCommentRepliesLoadingState.set(null)),
      )
      .subscribe({
        next: (res) => {
          this._commentRepliesState.update((current) => {
            const newMap = new Map(current);
            newMap.set(commentId, res.data.replies);
            return newMap;
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private reverseCommentLikeState(postId: string, userId: string): void {
    this._postCommentsState.update((current) => {
      const newMap = new Map(current);
      const postComments = newMap.get(postId);

      if (!postComments) return newMap;

      const updatedComments = postComments.map((c) => {
        const wasLiked = c.likes.includes(userId);
        const updatedLikes = wasLiked
          ? c.likes.filter((id) => id !== userId)
          : [...c.likes, userId];

        return { ...c, likes: updatedLikes };
      });

      newMap.set(postId, updatedComments);
      return newMap;
    });
  }

  private reverseReplyLikeState(commentId: string, replyId: string, userId: string): void {
    this._commentRepliesState.update((current) => {
      const newMap = new Map(current);
      const commentReplies = newMap.get(commentId);

      if (!commentReplies) return newMap;

      const updatedReplies = commentReplies.map((r) => {
        const wasLiked = r.likes.includes(userId);
        const updatedLikes = wasLiked
          ? r.likes.filter((id) => id !== userId)
          : [...r.likes, userId];

        return { ...r, likes: updatedLikes };
      });

      newMap.set(commentId, updatedReplies);
      return newMap;
    });
  }

  toggleLikeComment(postId: string, commentId: string): void {
    const currentUserId = this.authService.getUserId();
    if (!currentUserId) return;

    this._toggleLikeCommentLoadingState.set(commentId);

    this.postApiService
      .toggleLikeComment(postId, commentId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._toggleLikeCommentLoadingState.set(null)),
      )
      .subscribe({
        next: () => {
          this.reverseCommentLikeState(postId, currentUserId);
        },
        error: (err) => {
          toast.error("Couldn't like this comment", {
            id: `toggleLikeComment${commentId}`,
            description: `${err.error.message}`,
          });
        },
      });
  }

  toggleLikeReply(postId: string, commentId: string, replyId: string): void {
    const currentUserId = this.authService.getUserId();
    if (!currentUserId) return;

    this._toggleLikeCommentLoadingState.set(replyId);

    this.postApiService
      .toggleLikeComment(postId, replyId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._toggleLikeCommentLoadingState.set(null)),
      )
      .subscribe({
        next: () => {
          this.reverseReplyLikeState(commentId, replyId, currentUserId);
        },
        error: (err) => {
          toast.error("Couldn't like this reply", {
            id: `toggleLikeReply${commentId}`,
            description: `${err.error.message}`,
          });
        },
      });
  }

  createTempComment(data: ICreateCommentREQ, postId: string): void {
    const user = this.profileFacadeService.myData();
    if (!user) return;

    const now = Date.now();
    let preview: string = '';
    if (data.image) preview = URL.createObjectURL(data.image);

    this._uploadingCommentState.set({
      _id: `uploading${now}`,
      content: data.content,
      image: preview || undefined,
      commentCreator: user,
      createdAt: now.toString(),
      likes: [],
      parentComment: null,
      post: postId,
      repliesCount: 0,
    });
  }

  createComment(postId: string, data: ICreateCommentREQ): void {
    this._createCommentLoadingState.set(true);

    this.createTempComment(data, postId);

    const formData: FormData = new FormData();

    if (data.content) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);

    this.postApiService
      .createComment(postId, formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this._createCommentLoadingState.set(false);
          this._uploadingCommentState.set(null);
        }),
      )
      .subscribe({
        next: (res) => {
          this.addComment(postId, res.data.comment);
          this.updatePostCommentsCount(postId, 1);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  createReply(postId: string, commentId: string, data: ICreateCommentREQ): void {
    this._createCommentLoadingState.set(true);

    const formData: FormData = new FormData();

    if (data.content) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);

    this.postApiService
      .createReply(postId, commentId, formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this._createCommentLoadingState.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.addReply(commentId, res.data.reply);
          this.updateCommentRepliesCount(postId, commentId, 1);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteComment(postId: string, commentId: string): void {
    this._deleteCommentLoadingState.set(true);

    this.postApiService
      .deleteComment(postId, commentId)
      .pipe(finalize(() => this._deleteCommentLoadingState.set(false)))
      .subscribe({
        next: () => {
          this.removeComment(postId, commentId);
          this.updatePostCommentsCount(postId, -1);
        },
        error: (err) => {
          toast.error("Couldn't delete this comment", {
            id: `deletecomment${commentId}`,
            description: `${err.error.message}`,
          });
        },
      });
  }

  deleteReply(postId: string, commentId: string, replyId: string): void {
    this._deleteCommentLoadingState.set(true);

    this.postApiService
      .deleteComment(postId, replyId)
      .pipe(finalize(() => this._deleteCommentLoadingState.set(false)))
      .subscribe({
        next: () => {
          this.removeReply(commentId, replyId);
          this.updateCommentRepliesCount(postId, commentId, -1);
        },
        error: (err) => {
          toast.error("Couldn't delete this reply", {
            id: `deletereply${replyId}`,
            description: `${err.error.message}`,
          });
        },
      });
  }
}
