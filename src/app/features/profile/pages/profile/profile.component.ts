import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import {
  LucideArrowLeft,
  LucideBookmark,
  LucideCamera,
  LucideExpand,
  LucideFileText,
  LucideMail,
  LucideUserPlus,
  LucideCheck,
  LucideLoader,
  LucideCake,
  LucideTrash,
} from '@lucide/angular';
import { ProfileFacadeService } from '../../services/profile-facade.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ImageZoomComponent } from '../../../../shared/components/image-zoom/image-zoom.component';
import { CopyonclickDirective } from '../../../../shared/directives/copy-on-click.directive';
import { PostFacadeService } from '../../../post/services/post-facade.service';
import { PostCardComponent } from '../../../post/components/post-card/post-card.component';
import { PostsFilterBtnComponent } from '../../../home/components/posts-filter-btn/posts-filter-btn.component';
import { POSTS_FILTER, PostsFilter } from '../../../home/interfaces/posts-filter.interface';
import { EmptyPostsComponent } from '../../../../shared/components/empty-posts/empty-posts.component';
import { UserFacadeService } from '../../../../core/services/user/user-facade.service';
import { ProfilePictureChangeComponent } from '../../components/profile-picture-change/profile-picture-change.component';
import { IProfileView, IUpdateProfilePictureData } from '../../interfaces/profile.interface';
import { DeleteDialogComponent } from '../../../../shared/components/delete-dialog/delete-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { PostLoadingComponent } from '../../../post/components/post-loading/post-loading.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { NavigationService } from '../../../../core/services/Navigation/navigation.service';

@Component({
  imports: [
    LucideCamera,
    LucideExpand,
    LucideUserPlus,
    LucideMail,
    LucideArrowLeft,
    LucideFileText,
    LucideBookmark,
    LucideCheck,
    LucideLoader,
    LucideTrash,
    LucideCake,
    ImageZoomComponent,
    CopyonclickDirective,
    PostCardComponent,
    PostsFilterBtnComponent,
    EmptyPostsComponent,
    ProfilePictureChangeComponent,
    DeleteDialogComponent,
    TranslatePipe,
    PostLoadingComponent,
    DateFormatPipe,
  ],
  selector: 'app-profile',
  styleUrl: './profile.component.css',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  protected readonly profileFacade = inject(ProfileFacadeService);
  protected readonly authService = inject(AuthService);
  protected readonly userFacade = inject(UserFacadeService);
  protected readonly postFacade = inject(PostFacadeService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);

  protected readonly routeId = toSignal(
    this.activatedRoute.paramMap.pipe(map((param) => param.get('id'))),
  );

  private readonly userId = signal<string>(this.authService.getUserId());

  // constructor() {
  //   effect(() => {
  //     const id = this.routeId();
  //     untracked(() => this.loadFor(id)); // untracked so facade signals don't re-trigger the effect
  //   });
  // }

  readonly isMe = computed(() => {
    const routeId = this.routeId();

    return !routeId || routeId === this.userId();
  });

  readonly profile = computed<IProfileView | null>(() => {
    if (this.isMe()) {
      const user = this.userFacade.user();
      return user ? { user, isFollowing: false, isMyProfile: true } : null;
    }
    return this.profileFacade.profile();
  });

  goBack(): void {
    this.navigationService.back();
  }

  readonly openProfilePicture = signal<boolean>(false);
  readonly openProfileCover = signal<boolean>(false);

  readonly postsFilter = POSTS_FILTER;

  onFilterSelect(filter: PostsFilter): void {
    this.postFacade.handleFilterChange({ newFilter: filter, refetch: false });
  }

  readonly selectedCover = signal<File | null>(null);
  readonly selectedProfilePicture = signal<File | null>(null);

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] ?? null;

    if (file) this.selectedCover.set(file);
  }

  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] ?? null;

    if (file) this.selectedProfilePicture.set(file);
  }

  closeProfilePictureChange(): void {
    this.selectedProfilePicture.set(null);
  }

  closeProfileCoverChange(): void {
    this.selectedCover.set(null);
  }

  saveProfilePicture(data: IUpdateProfilePictureData): void {
    this.userFacade.changeProfilePicture(data);
  }

  saveCover(data: IUpdateProfilePictureData): void {
    this.userFacade.changeCoverPicture(data);
  }

  readonly openDeleteDialog = signal<boolean>(false);

  ngOnInit(): void {
    if (this.isMe()) {
      this.postFacade.handleFilterChange({ newFilter: this.postsFilter.SAVED });
      this.postFacade.handleFilterChange({
        newFilter: this.postsFilter.MY_POSTS,
      });
    } else {
      this.profileFacade.getUserProfile(this.routeId()!);
      this.postFacade.handleFilterChange({
        newFilter: this.postsFilter.USER_POSTS,
        userId: this.routeId(),
        refetch: true,
      });
    }
  }
}
