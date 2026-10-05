import { Component, inject, OnInit, signal } from '@angular/core';
import { PostFacadeService } from '../../../post/services/post-facade.service';
import { POSTS_FILTER } from '../../interfaces/posts-filter.interface';
import { PostsFilterComponent } from '../../components/posts-filter/posts-filter.component';
import { EmptyPostsComponent } from '../../../../shared/components/empty-posts/empty-posts.component';
import { NearEndDirective } from '../../../../shared/directives/near-end.directive';
import { LoadingMoreComponent } from '../../../../shared/components/loading-more/loading-more.component';
import { PostsLoadingComponent } from '../../../post/components/posts-loading/posts-loading.component';
import { PostCardComponent } from '../../../post/components/post-card/post-card.component';
import { CreatePostComponent } from '../../../post/create-post/components/create-post/create-post.component';
import { CreatePostLoadingComponent } from '../../../post/create-post/components/create-post-loading/create-post-loading.component';
import { UserFacadeService } from '../../../../core/services/user/user-facade.service';
import { FollowSuggestionsComponent } from '../../../follow-suggestions/pages/follow-suggestions/follow-suggestions.component';

@Component({
  selector: 'app-home-page',
  imports: [
    PostsFilterComponent,
    EmptyPostsComponent,
    NearEndDirective,
    LoadingMoreComponent,
    PostsLoadingComponent,
    PostCardComponent,
    CreatePostComponent,
    CreatePostLoadingComponent,
    FollowSuggestionsComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  protected postFacadeService = inject(PostFacadeService);
  protected userFacade = inject(UserFacadeService);

  ngOnInit(): void {
    this.postFacadeService.handleFilterChange({ newFilter: POSTS_FILTER.FEED });
  }
}
