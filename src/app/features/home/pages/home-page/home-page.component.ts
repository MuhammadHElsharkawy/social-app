import { Component, inject, OnInit, signal } from '@angular/core';
import { PostFacadeService } from '../../../post/services/post-facade.service';
import { POSTS_FILTER } from '../../interfaces/posts-filter.interface';
import { PostsFilterComponent } from '../../components/posts-filter/posts-filter.component';
import { LucideUsers, LucideSearch } from '@lucide/angular';
import { EmptyPostsComponent } from '../../../../shared/components/empty-posts/empty-posts.component';
import { NearEndDirective } from '../../../../shared/directives/near-end.directive';
import { LoadingMoreComponent } from '../../../../shared/components/loading-more/loading-more.component';
import { PostsLoadingComponent } from '../../../post/components/posts-loading/posts-loading.component';
import { PostCardComponent } from '../../../post/components/post-card/post-card.component';
import { CreatePostComponent } from '../../../post/create-post/components/create-post/create-post.component';
import { CreatePostLoadingComponent } from '../../../post/create-post/components/create-post-loading/create-post-loading.component';
import { ProfileFacadeService } from '../../../profile/services/profile-facade.service';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-home-page',
  imports: [
    LucideUsers,
    LucideSearch,
    PostsFilterComponent,
    EmptyPostsComponent,
    NearEndDirective,
    LoadingMoreComponent,
    PostsLoadingComponent,
    PostCardComponent,
    CreatePostComponent,
    CreatePostLoadingComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  protected postFacadeService = inject(PostFacadeService);
  protected profileFacadeService = inject(ProfileFacadeService);

  openDeleteDialog = signal<boolean>(false);
  deletePostId = signal<string | null>(null);

  handleDeleteClick(postId: string): void {
    this.openDeleteDialog.set(true);
    this.deletePostId.set(postId);
  }

  handleConfirmDeleteClick(): void {
    if (!this.deletePostId()) return;

    this.postFacadeService.deletePost(this.deletePostId()!).subscribe({
      next: () => {
        this.openDeleteDialog.set(false);
        this.deletePostId.set(null);
      },
      error: () => {
        toast.error("Couldn't delete this post", {
          id: `deletedpost${this.deletePostId()}`,
          description: 'Check your connection and try again.',
        });
      },
    });
  }

  closeDeleteDialog(): void {
    this.openDeleteDialog.set(false);
  }

  ngOnInit(): void {
    this.postFacadeService.handleFilterChange(POSTS_FILTER.FEED);
  }
}
