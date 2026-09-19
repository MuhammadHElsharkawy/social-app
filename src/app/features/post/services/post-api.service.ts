import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IDeletePostRES,
  IGetBookmarksRES,
  IGetPostsRES,
  ISharePostREQ,
  ISharePostRES,
} from '../interfaces/post.interfaces';
import { PostEndPoints } from '../constants/post-endpoints';
import { IGetPostLikesRES, IToggleLikePostRES } from '../interfaces/like.interface';
import { ICreatePostRES, IUpdatePostREQ } from '../create-post/interfaces/create-post.interface';
import { IToggleBookmarkPostRES } from '../interfaces/bookmark.interface';
import {
  IDeleteCommentRES,
  IGetCommentRepliesRES,
  IGetPostCommentsRES,
  ISingleCommentRES,
  ISingleReplyRES,
  IToggleLikeCommentRES,
} from '../comment/interfaces/comment.interface';

@Service()
export class PostApiService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(page: number = 1, limit: number = 10): Observable<IGetPostsRES> {
    return this.httpClient.get<IGetPostsRES>(PostEndPoints.GetAllPosts(page, limit));
  }
  getFeedPosts(page: number = 1, limit: number = 10): Observable<IGetPostsRES> {
    return this.httpClient.get<IGetPostsRES>(PostEndPoints.GetFeedPosts(page, limit));
  }
  getSavedPosts(page: number = 1, limit: number = 10): Observable<IGetBookmarksRES> {
    return this.httpClient.get<IGetBookmarksRES>(PostEndPoints.GetBookmarks(page, limit));
  }
  getUserPosts(userId: string, page: number = 1, limit: number = 10): Observable<IGetPostsRES> {
    return this.httpClient.get<IGetPostsRES>(PostEndPoints.GetUserPosts(userId, page, limit));
  }

  createPost(data: FormData): Observable<ICreatePostRES> {
    return this.httpClient.post<ICreatePostRES>(PostEndPoints.CreatePost, data);
  }

  getPostLikes(postId: string): Observable<IGetPostLikesRES> {
    return this.httpClient.get<IGetPostLikesRES>(PostEndPoints.GetPostlikes(postId));
  }
  ToggleLikePost(postId: string): Observable<IToggleLikePostRES> {
    return this.httpClient.put<IToggleLikePostRES>(PostEndPoints.ToggleLikePost(postId), {});
  }

  toggleBookmarkPost(postId: string): Observable<IToggleBookmarkPostRES> {
    return this.httpClient.put<IToggleBookmarkPostRES>(
      PostEndPoints.ToggleBookmarkPost(postId),
      {},
    );
  }

  deletePost(postId: string): Observable<IDeletePostRES> {
    return this.httpClient.delete<IDeletePostRES>(PostEndPoints.DeletePost(postId));
  }

  updatePostPrivacy(postId: string, data: IUpdatePostREQ): Observable<ICreatePostRES> {
    return this.httpClient.put<ICreatePostRES>(PostEndPoints.UpdatePost(postId), data);
  }

  updatePostContent(postId: string, data: FormData): Observable<ICreatePostRES> {
    return this.httpClient.put<ICreatePostRES>(PostEndPoints.UpdatePost(postId), data);
  }

  getPostComments(
    postId: string,
    page: number = 1,
    limit: number = 5,
  ): Observable<IGetPostCommentsRES> {
    return this.httpClient.get<IGetPostCommentsRES>(
      PostEndPoints.COMMENTS.GetPostComments(postId, page, limit),
    );
  }

  getCommentReplies(
    postId: string,
    commentId: string,
    page: number = 1,
    limit: number = 5,
  ): Observable<IGetCommentRepliesRES> {
    return this.httpClient.get<IGetCommentRepliesRES>(
      PostEndPoints.COMMENTS.GetCommentReplies(postId, commentId, page, limit),
    );
  }

  toggleLikeComment(postId: string, commentId: string): Observable<IToggleLikeCommentRES> {
    return this.httpClient.put<IToggleLikeCommentRES>(
      PostEndPoints.COMMENTS.ToggleLikeComment(postId, commentId),
      {},
    );
  }

  createComment(postId: string, data: FormData): Observable<ISingleCommentRES> {
    return this.httpClient.post<ISingleCommentRES>(
      PostEndPoints.COMMENTS.CreateComment(postId),
      data,
    );
  }

  createReply(postId: string, commentId: string, data: FormData): Observable<ISingleReplyRES> {
    return this.httpClient.post<ISingleReplyRES>(
      PostEndPoints.COMMENTS.CreateReply(postId, commentId),
      data,
    );
  }

  deleteComment(postId: string, commentId: string): Observable<IDeleteCommentRES> {
    return this.httpClient.delete<IDeleteCommentRES>(
      PostEndPoints.COMMENTS.DeleteComment(postId, commentId),
    );
  }

  updateComment(postId: string, commentId: string, data: FormData): Observable<ISingleCommentRES> {
    return this.httpClient.put<ISingleCommentRES>(
      PostEndPoints.COMMENTS.UpdateComment(postId, commentId),
      data,
    );
  }

  sharePost(postId: string, data: ISharePostREQ): Observable<ISharePostRES> {
    return this.httpClient.post<ISharePostRES>(PostEndPoints.SharePost(postId), data);
  }
}
