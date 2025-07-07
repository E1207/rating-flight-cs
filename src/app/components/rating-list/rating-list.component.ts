import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RateService } from '../../services/rate.service';
import { AuthService } from '../../services/auth.service';
import { Rate } from '../../models/rate.model';
import { RateResponse } from '../../models/RateResponse.model';
import { ResponsePopupComponent } from '../response-popup/response-popup.component';

@Component({
  selector: 'app-rating-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ResponsePopupComponent],
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.scss']
})
export class RatingListComponent implements OnInit {
  rates: Rate[] = [];
  loading = false;
  error = false;
  isAdmin = false;
  
  // Popup state
  showResponsePopup = false;
  selectedRateId: number | null = null;
  selectedFlightNumber = '';
  selectedCompany = '';

  constructor(
    private rateService: RateService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin;
    this.loadRates();
  }

  loadRates(): void {
    this.loading = true;
    this.error = false;

    this.rateService.getRates().subscribe({
      next: (response) => {
        // Trier les réponses par date pour chaque avis
        this.rates = response.map(rate => ({
          ...rate,
          rateResponse: rate.rateResponse?.sort((a, b) => 
            new Date(a.responseAt).getTime() - new Date(b.responseAt).getTime()
          ) || []
        }));
        this.loading = false;
        console.log('Avis chargés:', this.rates);
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
        console.error('Erreur lors du chargement des avis:', error);
      }
    });
  }

  goBackToForm(): void {
    this.router.navigate(['/']);
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAdmin = false;
    this.router.navigate(['/']);
  }

  respondToRate(rateId: number): void {
    const rate = this.rates.find(r => r.id === rateId);
    if (rate) {
      this.selectedRateId = rateId;
      this.selectedFlightNumber = rate.flightNumber;
      this.selectedCompany = rate.company;
      this.showResponsePopup = true;
    }
  }

  closeResponsePopup(): void {
    this.showResponsePopup = false;
    this.selectedRateId = null;
    this.selectedFlightNumber = '';
    this.selectedCompany = '';
  }

  onResponseAdded(newResponse: RateResponse): void {
    // Ajouter la nouvelle réponse à l'avis correspondant
    if (this.selectedRateId) {
      const rateIndex = this.rates.findIndex(r => r.id === this.selectedRateId);
      if (rateIndex !== -1) {
        if (!this.rates[rateIndex].rateResponse) {
          this.rates[rateIndex].rateResponse = [];
        }
        // Ajouter la nouvelle réponse et trier par date
        this.rates[rateIndex].rateResponse!.push(newResponse);
        this.rates[rateIndex].rateResponse!.sort((a, b) => 
          new Date(a.responseAt).getTime() - new Date(b.responseAt).getTime()
        );
      }
    }
  }
}
