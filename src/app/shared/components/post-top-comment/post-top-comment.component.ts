import { Component, input } from '@angular/core';
import { ITopComment } from '../../../features/post/interfaces/comment.interface';

@Component({
  selector: 'app-post-top-comment',
  imports: [],
  templateUrl: './post-top-comment.component.html',
  styleUrl: './post-top-comment.component.css',
})
export class PostTopCommentComponent {
  topComment = input.required<ITopComment>();
}
