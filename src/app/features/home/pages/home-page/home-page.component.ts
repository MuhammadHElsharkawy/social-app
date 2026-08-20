import { Component, inject, OnInit } from '@angular/core';
import { PostFacadeService } from '../../../post/services/post-facade.service';
import { POSTS_FILTER } from '../../interfaces/posts-filter.interface';
import { PostsFilterComponent } from '../../components/posts-filter/posts-filter.component';
import {
  LucideEarth,
  LucideFaceSlightlySmiling,
  LucideImage,
  LucideSearch,
  LucideSend,
  LucideUsers,
} from '@lucide/angular';
import { EmptyPostsComponent } from '../../../../shared/components/empty-posts/empty-posts.component';
import { NearEndDirective } from '../../../../shared/directives/near-end.directive';
import { LoadingMoreComponent } from '../../../../shared/components/loading-more/loading-more.component';
import { PostCardComponent } from '../../../../shared/components/post-card/post-card.component';
import { PostsLoadingComponent } from '../../../../shared/components/posts-loading/posts-loading.component';

@Component({
  selector: 'app-home-page',
  imports: [
    LucideUsers,
    LucideSearch,
    LucideEarth,
    LucideImage,
    LucideFaceSlightlySmiling,
    LucideSend,
    PostsFilterComponent,
    EmptyPostsComponent,
    PostsLoadingComponent,
    NearEndDirective,
    LoadingMoreComponent,
    PostCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  protected postFacadeService = inject(PostFacadeService);

  ngOnInit(): void {
    this.postFacadeService.handleFilterChange(POSTS_FILTER.FEED);
  }
}
