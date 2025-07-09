import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RatingFlightComponent } from './components/rating-flight/rating-flight.component';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { RateDetailComponent } from './components/rate-detail/rate-detail.component';
import { LoginComponent } from './components/admin/login/login.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'avis/form', component: RatingFlightComponent },
  { path: 'avis', component: RatingListComponent },
  { path: 'avis/:id', component: RateDetailComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: RatingListComponent, 
    canActivate: [AdminGuard] 
  },
  { path: '**', redirectTo: '' } // Route par défaut
];
