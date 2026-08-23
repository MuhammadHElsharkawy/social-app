import { Component, input } from '@angular/core';
import { ITopComment } from '../../interfaces/comment.interface';

@Component({
  selector: 'app-post-top-comment',
  imports: [],
  templateUrl: './post-top-comment.component.html',
  styleUrl: './post-top-comment.component.css',
})
export class PostTopCommentComponent {
  topComment = input.required<ITopComment>();
}
