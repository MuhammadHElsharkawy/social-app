import { Component, input } from '@angular/core';
import { ILike } from '../../../features/post/interfaces/like.interface';

@Component({
  imports: [],
  selector: 'app-post-like-card',
  styleUrl: './post-like-card.component.css',
  templateUrl: './post-like-card.component.html',
})
export class PostLikeCardComponent {
  like = input.required<ILike>()
}
