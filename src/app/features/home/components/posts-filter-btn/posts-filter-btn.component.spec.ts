import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsFilterBtnComponent } from './posts-filter-btn.component';

describe('PostsFilterBtnComponent', () => {
  let component: PostsFilterBtnComponent;
  let fixture: ComponentFixture<PostsFilterBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsFilterBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsFilterBtnComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
