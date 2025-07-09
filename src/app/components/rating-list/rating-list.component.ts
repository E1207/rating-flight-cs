import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect, ViewChild, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RateService } from '../../services/rate.service';
import { AuthService } from '../../services/auth.service';
import { Rate } from '../../models/rate.model';
import { RateStatus } from '../../models/rate-status.model';
import { RateResponse } from '../../models/RateResponse.model';
import { ResponsePopupComponent } from '../response-popup/response-popup.component';


@Component({
    selector: 'app-rating-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ResponsePopupComponent],
    templateUrl: './rating-list.component.html',
    styleUrls: ['./rating-list.component.scss']
})
export class RatingListComponent {
  rates = signal<Rate[]>([]);
  loading = signal(false);
  error = signal(false);

  searchKeyword = signal('');
  selectedCompany = signal('');
  selectedFlightNumber = signal('');
  selectedStatus = signal<RateStatus | ''>('');
  showTodayOnly = signal(false);
  @ViewChild(ResponsePopupComponent) responsePopup!: ResponsePopupComponent;

  private rateService = inject(RateService);
  private router = inject(Router);
  authService = inject(AuthService);

  statusOptions: { value: RateStatus | '', label: string }[] = [
    { value: '', label: 'Tous les statuts' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'PROCESSED', label: 'Traité' },
    { value: 'PUBLISHED', label: 'Publié' },
    { value: 'REJECTED', label: 'Rejeté' }
  ];

  constructor() {
    // Charger les avis au démarrage
    this.loadRates();
  }

  filteredRates = computed(() => {
    const allRates = this.rates();
    const keyword = this.searchKeyword().toLowerCase().trim();
    const company = this.selectedCompany().toLowerCase().trim();
    const flightNumber = this.selectedFlightNumber().toLowerCase().trim();
    const status = this.selectedStatus();
    const todayOnly = this.showTodayOnly();

    let filtered = allRates;

    // Filtre par mot-clé dans le commentaire
    if (keyword) {
      filtered = filtered.filter(rate => 
        rate.comment.toLowerCase().includes(keyword)
      );
    }

    // Filtre par compagnie
    if (company) {
      filtered = filtered.filter(rate => 
        rate.company.toLowerCase().includes(company)
      );
    }

    // Filtre par numéro de vol
    if (flightNumber) {
      filtered = filtered.filter(rate => 
        rate.flightNumber.toLowerCase().includes(flightNumber)
      );
    }

    // Filtre par statut
    if (status) {
      filtered = filtered.filter(rate => 
        rate.status === status
      );
    }

    // Filtre par date du jour
    if (todayOnly) {
      const today = new Date().toDateString();
      filtered = filtered.filter(rate => {
        if (rate.flightDate) {
          const flightDate = new Date(rate.flightDate).toDateString();
          return flightDate === today;
        }
        return false;
      });
    }

    return filtered;
  });

  // Computed pour les compagnies uniques (pour la liste déroulante)
  uniqueCompanies = computed(() => {
    const companies = this.rates().map(rate => rate.company);
    return [...new Set(companies)].sort();
  });

  // Computed pour les numéros de vol uniques (pour la liste déroulante)
  uniqueFlightNumbers = computed(() => {
    const flightNumbers = this.rates().map(rate => rate.flightNumber);
    return [...new Set(flightNumbers)].sort();
  });

  loadRates(): void {
    this.loading.set(true);
    this.error.set(false);

    // Les admins voient tous les avis, les utilisateurs normaux ne voient que les publiés
    const ratesObservable = this.authService.isAdmin ? 
      this.rateService.getRates() : 
      this.rateService.getPublishedRates();

    ratesObservable.subscribe({
      next: (response) => {
        console.log('Données reçues du backend (getRates):', response);
        console.log('Premier avis avec status:', response[0]?.status);
        
        const sortedRates = response.map(rate => ({
          ...rate,
          rateResponse: rate.rateResponse?.sort((a, b) => 
            new Date(a.responseAt).getTime() - new Date(b.responseAt).getTime()
          ) || []
        }));
        
        this.rates.set(sortedRates);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  goBackToForm(): void {
    this.router.navigate(['/avis/form']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  formatDate(dateString: string | number[]): string {
    if (!dateString) return 'Date non disponible';
    
    let date: Date;

    if (Array.isArray(dateString)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateString;
      date = new Date(year, month - 1, day, hour, minute, second); // month - 1 car en JS les mois commencent à 0
    } else {
      date = new Date(dateString);
    }
    
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
    this.router.navigate(['/']);
  }

  respondToRate(rateId: number): void {
    const rate = this.rates().find(r => r.id === rateId);
    if (rate && this.responsePopup) {
      this.responsePopup.show(rateId, rate.flightNumber, rate.company);
    }
  }

  closeResponsePopup(): void {
    if (this.responsePopup) {
      this.responsePopup.hide();
    }
  }

  onResponseAdded(event: {response: RateResponse, rateId: number}): void {
    // Ajouter la nouvelle réponse à l'avis correspondant
    const currentRates = this.rates();
    const rateIndex = currentRates.findIndex(r => r.id === event.rateId);
    
    if (rateIndex !== -1) {
      const updatedRates = [...currentRates];
      
      if (!updatedRates[rateIndex].rateResponse) {
        updatedRates[rateIndex].rateResponse = [];
      }
      
      // Ajouter la nouvelle réponse et trier par date
      updatedRates[rateIndex].rateResponse!.push(event.response);
      updatedRates[rateIndex].rateResponse!.sort((a, b) => 
        new Date(a.responseAt).getTime() - new Date(b.responseAt).getTime()
      );
      
      this.rates.set(updatedRates);
    }
  }

  // Méthodes pour gérer les filtres
  clearAllFilters(): void {
    this.searchKeyword.set('');
    this.selectedCompany.set('');
    this.selectedFlightNumber.set('');
    this.selectedStatus.set('');
    this.showTodayOnly.set(false);
  }

  updateKeywordFilter(keyword: string): void {
    this.searchKeyword.set(keyword);
  }

  updateCompanyFilter(company: string): void {
    this.selectedCompany.set(company);
  }

  updateFlightNumberFilter(flightNumber: string): void {
    this.selectedFlightNumber.set(flightNumber);
  }

  updateStatusFilter(status: RateStatus | ''): void {
    this.selectedStatus.set(status);
  }

  toggleTodayFilter(): void {
    this.showTodayOnly.set(!this.showTodayOnly());
  }

  // Méthodes pour gérer les statuts
  updateRateStatus(rateId: number, status: RateStatus): void {
    console.log('Tentative de mise à jour du statut:', { rateId, status });
    
    this.rateService.updateRateStatus(rateId, status).subscribe({
      next: (updatedRate) => {
        console.log('Réponse du backend:', updatedRate);
        
        // Pour le moment, forcer la mise à jour locale car le backend ne renvoie pas le status
        const currentRates = this.rates();
        const rateIndex = currentRates.findIndex(r => r.id === rateId);
        if (rateIndex !== -1) {
          const updatedRates = [...currentRates];
          updatedRates[rateIndex] = { ...updatedRates[rateIndex], status };
          this.rates.set(updatedRates);
        }
        
        console.log('Statut mis à jour localement:', status);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        console.error('Détails de l\'erreur:', error.error);
        // En cas d'erreur, recharger les données pour éviter la désynchronisation
        this.loadRates();
      }
    });
  }

  getStatusLabel(status?: RateStatus): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'En attente';
  }

  getStatusClass(status?: RateStatus): string {
    switch (status) {
      case 'PUBLISHED': return 'status-published';
      case 'PROCESSED': return 'status-processed';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  viewRateDetail(rateId: number): void {
    this.router.navigate(['/avis', rateId]);
  }
}
