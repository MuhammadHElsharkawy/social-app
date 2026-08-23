import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTopCommentComponent } from './post-top-comment.component';

describe('PostTopCommentComponent', () => {
  let component: PostTopCommentComponent;
  let fixture: ComponentFixture<PostTopCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTopCommentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostTopCommentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
