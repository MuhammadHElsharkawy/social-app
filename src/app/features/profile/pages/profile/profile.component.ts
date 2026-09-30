import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  LucideArrowLeft,
  LucideBookmark,
  LucideCamera,
  LucideExpand,
  LucideTrash2,
  LucideFileText,
  LucideMail,
  LucideUserPlus,
  LucideUsers,
  LucideCheck,
  LucideLoader,
} from '@lucide/angular';
import { ProfileFacadeService } from '../../services/profile-facade.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ImageZoomComponent } from '../../../../shared/components/image-zoom/image-zoom.component';
import { CopyonclickDirective } from '../../../../shared/directives/copy-on-click.directive';
import { Location } from '@angular/common';
import { PostFacadeService } from '../../../post/services/post-facade.service';
import { PostCardComponent } from '../../../post/components/post-card/post-card.component';
import { PostsFilterBtnComponent } from '../../../home/components/posts-filter-btn/posts-filter-btn.component';
import { POSTS_FILTER, PostsFilter } from '../../../home/interfaces/posts-filter.interface';
import { EmptyPostsComponent } from '../../../../shared/components/empty-posts/empty-posts.component';
import { UserFacadeService } from '../../../../core/services/user/user-facade.service';
import { ProfilePictureChangeComponent } from '../../components/profile-picture-change/profile-picture-change.component';
import { IProfileView, IUpdateProfilePictureData } from '../../interfaces/profile.interface';
import { DeleteDialogComponent } from '../../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  imports: [
    LucideCamera,
    LucideExpand,
    LucideUsers,
    LucideUserPlus,
    LucideMail,
    LucideArrowLeft,
    LucideFileText,
    LucideBookmark,
    LucideCheck,
    LucideLoader,
    LucideTrash2,
    ImageZoomComponent,
    CopyonclickDirective,
    PostCardComponent,
    PostsFilterBtnComponent,
    EmptyPostsComponent,
    ProfilePictureChangeComponent,
    DeleteDialogComponent,
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
  private readonly location = inject(Location);

  protected readonly routeId = toSignal(
    this.activatedRoute.paramMap.pipe(map((param) => param.get('id'))),
  );

  private userId = this.authService.getUserId();

  readonly isMe = computed(() => {
    const routeId = this.routeId();

    return !routeId || routeId === this.userId;
  });

  readonly profile = computed<IProfileView | null>(() => {
    const routeId = this.routeId();

    if (routeId) {
      return this.profileFacade.profile();
    }

    const user = this.userFacade.user();

    if (!user) {
      return null;
    }

    return {
      user,
      isFollowing: false,
      isMyProfile: true,
    };
  });

  goBack(): void {
    this.location.back();
  }

  openProfilePicture = signal<boolean>(false);
  openProfileCover = signal<boolean>(false);

  readonly POSTS_FILTER_BTNS = POSTS_FILTER;

  onFilterSelect(filter: PostsFilter): void {
    this.postFacade.handleFilterChange({ newFilter: filter, refetch: false });
  }

  selectedCover = signal<File | null>(null);
  selectedProfilePicture = signal<File | null>(null);

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

  saveProfilePicture(data: IUpdateProfilePictureData) {
    this.userFacade.changeProfilePicture(data);
  }

  saveCover(data: IUpdateProfilePictureData) {
    this.userFacade.changeCoverPicture(data);
  }

  openDeleteDialog = signal<boolean>(false);

  ngOnInit(): void {
    if (this.isMe()) {
      this.postFacade.handleFilterChange({ newFilter: this.POSTS_FILTER_BTNS.SAVED });
      this.postFacade.handleFilterChange({
        newFilter: this.POSTS_FILTER_BTNS.MY_POSTS,
      });
    } else {
      this.profileFacade.getUserProfile(this.routeId()!);
      this.postFacade.handleFilterChange({
        newFilter: this.POSTS_FILTER_BTNS.USER_POSTS,
        userId: this.routeId(),
        refetch: true,
      });
    }
  }
}
