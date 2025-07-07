// src/app/pages/login/login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.authService.login(this.username, this.password)) {
      // Redirection automatique vers la page d'administration
      this.router.navigate(['/admin']);
    } else {
      this.error = 'Identifiants invalides';
      this.loading = false;
    }
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }
}
