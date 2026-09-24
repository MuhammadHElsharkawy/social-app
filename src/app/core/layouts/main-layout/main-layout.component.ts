import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { UserFacadeService } from '../../services/user/user-facade.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, LoadingOverlayComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  protected userFacade = inject(UserFacadeService);

  ngOnInit(): void {
    this.userFacade.getUser();
  }
}
