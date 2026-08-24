import { Component, input } from '@angular/core';
import { IPostUploading } from '../../interfaces/create-post.interface';

@Component({
  imports: [],
  selector: 'app-create-post-loading',
  styleUrl: './create-post-loading.component.css',
  templateUrl: './create-post-loading.component.html',
})
export class CreatePostLoadingComponent {
  data = input.required<IPostUploading | null>();
}
