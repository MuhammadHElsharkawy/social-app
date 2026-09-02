import { Component, forwardRef, inject, input, OnInit } from '@angular/core';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { CommentTextAreaComponent } from '../../../components/comment-text-area/comment-text-area.component';
import { PostFacadeService } from '../../../services/post-facade.service';
import { IComment } from '../../interfaces/comment.interface';

@Component({
  imports: [forwardRef(() => CommentCardComponent), CommentTextAreaComponent],
  selector: 'app-comment-replies',
  styleUrl: './comment-replies.component.css',
  templateUrl: './comment-replies.component.html',
})
export class CommentRepliesComponent implements OnInit {
  protected readonly postFacade = inject(PostFacadeService);

  postId = input.required<string>();
  comment = input.required<IComment>();

  ngOnInit(): void {
    this.postFacade.getCommentReplies(this.postId(), this.comment()._id);
  }
}
