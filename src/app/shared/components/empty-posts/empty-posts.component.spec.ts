import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyPostsComponent } from './empty-posts.component';

describe('EmptyPostsComponent', () => {
  let component: EmptyPostsComponent;
  let fixture: ComponentFixture<EmptyPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyPostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyPostsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
