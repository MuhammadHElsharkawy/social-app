import { Component, computed, inject, input } from '@angular/core';
import { ILike } from '../../interfaces/like.interface';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-post-like-card',
  styleUrl: './post-like-card.component.css',
  templateUrl: './post-like-card.component.html',
})
export class PostLikeCardComponent {
  private readonly authService = inject(AuthService);

  like = input.required<ILike>();

  isMyPost = computed<boolean>(() => this.authService.getUserId() === this.like()._id);
}
