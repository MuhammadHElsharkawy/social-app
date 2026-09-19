import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedPostCardComponent } from './shared-post-card.component';

describe('SharedPostCardComponent', () => {
  let component: SharedPostCardComponent;
  let fixture: ComponentFixture<SharedPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedPostCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedPostCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
