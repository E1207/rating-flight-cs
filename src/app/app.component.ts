import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rating-flight-cs';
  router = inject(Router);

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
