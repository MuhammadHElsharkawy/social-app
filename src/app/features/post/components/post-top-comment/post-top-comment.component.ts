import { Component, input, output } from '@angular/core';
import { IComment } from '../../comment/interfaces/comment.interface';

@Component({
  selector: 'app-post-top-comment',
  imports: [],
  templateUrl: './post-top-comment.component.html',
  styleUrl: './post-top-comment.component.css',
})
export class PostTopCommentComponent {
  topComment = input.required<IComment>();

  onViewAllComments = output();
}
