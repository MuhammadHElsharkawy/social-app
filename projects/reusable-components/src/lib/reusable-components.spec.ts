import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReusableComponents } from './reusable-components';

describe('ReusableComponents', () => {
  let component: ReusableComponents;
  let fixture: ComponentFixture<ReusableComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
