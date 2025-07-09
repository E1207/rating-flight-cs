import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  router = inject(Router);

  navigateToForm(): void {
    this.router.navigate(['/avis/form']);
  }

  navigateToRatingList(): void {
    this.router.navigate(['/avis']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
