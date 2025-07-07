import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    this.checkExistingSession();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get isAdmin$(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private checkExistingSession(): void {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const userDataStr = localStorage.getItem('currentUser');
    
    if (isLoggedIn && userDataStr) {
      try {
        const userData: User = JSON.parse(userDataStr);
        this.setAuthenticationState(userData);
      } catch (error) {
        // Si erreur de parsing, on nettoie le localStorage
        this.clearSession();
      }
    }
  }

  login(username: string, password: string): boolean {
    // Simulation d'une authentification simple
    // En production, ceci ferait un appel HTTP vers votre backend
    if (username === 'admin' && password === 'admin123') {
      const user: User = {
        id: 1,
        username: 'admin',
        role: 'ADMIN'
      };
      
      this.setAuthenticationState(user);
      this.saveSession(user);
      return true;
    }
    return false;
  }

  private setAuthenticationState(user: User): void {
    this.isAuthenticatedSubject.next(true);
    this.isAdminSubject.next(user.role === 'ADMIN');
    this.currentUserSubject.next(user);
  }

  private saveSession(user: User): void {
    localStorage.setItem('isAdminLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    this.clearSession();
    this.clearAuthenticationState();
    this.router.navigate(['/']);
  }

  private clearSession(): void {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('currentUser');
  }

  private clearAuthenticationState(): void {
    this.isAuthenticatedSubject.next(false);
    this.isAdminSubject.next(false);
    this.currentUserSubject.next(null);
  }

  // Méthode utilitaire pour vérifier les permissions
  hasPermission(requiredRole: 'ADMIN' | 'USER'): boolean {
    const user = this.currentUser;
    if (!user || !this.isAuthenticated) {
      return false;
    }
    
    if (requiredRole === 'USER') {
      return true; // Tout utilisateur authentifié peut accéder aux fonctionnalités USER
    }
    
    return user.role === 'ADMIN';
  }
}
