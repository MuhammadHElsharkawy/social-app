import { Component, inject, input, OnInit } from '@angular/core';
import { LucideArrowLeft } from '@lucide/angular';
import { PostCardComponent } from '../post-card/post-card.component';
import { IPost } from '../../interfaces/post.interfaces';
import { PostFacadeService } from '../../services/post-facade.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Location } from '@angular/common';
import { PostLoadingComponent } from '../post-loading/post-loading.component';

@Component({
  imports: [LucideArrowLeft, PostCardComponent, PostLoadingComponent],
  selector: 'app-post-details',
  styleUrl: './post-details.component.css',
  templateUrl: './post-details.component.html',
})
export class PostDetailsComponent implements OnInit {
  protected readonly postFacade = inject(PostFacadeService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  protected readonly postId = toSignal(
    this.activatedRoute.paramMap.pipe(map((param) => param.get('id'))),
  );

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    if (this.postId()) this.postFacade.getPost(this.postId()!);
  }
}
