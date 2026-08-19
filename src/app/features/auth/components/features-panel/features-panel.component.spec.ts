import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesPanelComponent } from './features-panel.component';

describe('FeaturesPanelComponent', () => {
  let component: FeaturesPanelComponent;
  let fixture: ComponentFixture<FeaturesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesPanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
