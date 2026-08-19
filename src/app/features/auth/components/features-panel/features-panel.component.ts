import { Component } from '@angular/core';
import { LucideBell, LucideMessageCircleMore, LucideSquarePlus, LucideUserPlus } from '@lucide/angular';

@Component({
  selector: 'app-features-panel',
  imports: [LucideSquarePlus, LucideMessageCircleMore, LucideBell, LucideUserPlus],
  templateUrl: './features-panel.component.html',
  styleUrl: './features-panel.component.css',
})
export class FeaturesPanelComponent {}
