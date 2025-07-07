import { Routes } from '@angular/router';
import { RatingFlightComponent } from './components/rating-flight/rating-flight.component';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { LoginComponent } from './components/admin/login/login.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: RatingFlightComponent },
  { path: 'avis', component: RatingListComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: RatingListComponent, 
    canActivate: [AdminGuard] 
  },
  { path: '**', redirectTo: '' } // Route par défaut
];
