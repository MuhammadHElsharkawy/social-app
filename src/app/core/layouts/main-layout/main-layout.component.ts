import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { ProfileFacadeService } from '../../../features/profile/services/profile-facade.service';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, LoadingOverlayComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  protected profileFacadeService = inject(ProfileFacadeService);

  ngOnInit(): void {
    this.profileFacadeService.getMyProfile();
  }
}
