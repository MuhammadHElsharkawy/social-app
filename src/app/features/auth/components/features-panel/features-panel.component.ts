import { Component } from '@angular/core';
import { LucideBell, LucideMessageCircleMore, LucideSquarePlus, LucideUserPlus } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-features-panel',
  imports: [LucideSquarePlus, LucideMessageCircleMore, LucideBell, LucideUserPlus, TranslatePipe],
  templateUrl: './features-panel.component.html',
  styleUrl: './features-panel.component.css',
})
export class FeaturesPanelComponent {}
