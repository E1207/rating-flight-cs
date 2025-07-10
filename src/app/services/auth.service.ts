import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLogged = false;

  router = inject(Router);
  isAdmin = false;

  get isAuthenticated(): boolean {
    return this.isLogged;
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin123') {
      this.isLogged = true;
      this.isAdmin = true;
      return true;
    }
    this.isAdmin = false;
    return false;
  }

  logout(): void {
    this.isLogged = false;
    this.isAdmin = false;
    this.router.navigate(['/']);
  }
}