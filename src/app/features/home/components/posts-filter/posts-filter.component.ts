import { Component, input, output } from '@angular/core';
import { POSTS_FILTER, PostsFilter } from '../../interfaces/posts-filter.interface';
import { PostsFilterBtnComponent } from "../posts-filter-btn/posts-filter-btn.component";
import { LucideBookmark, LucideEarth, LucideNewspaper, LucideSparkles } from '@lucide/angular';

@Component({
  selector: 'app-posts-filter',
  imports: [LucideNewspaper, LucideSparkles, LucideEarth, LucideBookmark, PostsFilterBtnComponent],
  templateUrl: './posts-filter.component.html',
  styleUrl: './posts-filter.component.css',
})
export class PostsFilterComponent {
  selectedFilter = input.required<PostsFilter>();
  loadingFilter = input<PostsFilter | null>(null);

  filterClick = output<PostsFilter>();

  onFilterSelect(filter: PostsFilter): void {
    this.filterClick.emit(filter);
  }

  readonly POSTS_FILTER_BTNS = POSTS_FILTER;
}
