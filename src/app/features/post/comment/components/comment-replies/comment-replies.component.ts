import { Component, forwardRef, inject, input, OnInit } from '@angular/core';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { PostFacadeService } from '../../../services/post-facade.service';
import { IComment, ICommentContent } from '../../interfaces/comment.interface';
import { CommentTextAreaComponent } from '../comment-text-area/comment-text-area.component';

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

  createReply(data: ICommentContent): void {
    console.log('test create reply');
    
    this.postFacade.createReply(this.postId(), this.comment()._id, data);
  }

  ngOnInit(): void {
    this.postFacade.getCommentReplies(this.postId(), this.comment()._id);
  }
}
