import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RateService } from '../../services/rate.service';
import { AuthService } from '../../services/auth.service';
import { Rate } from '../../models/rate.model';

@Component({
  selector: 'app-rate-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rate-detail.component.html',
  styleUrls: ['./rate-detail.component.scss']
})
export class RateDetailComponent implements OnInit {
  rate = signal<Rate | null>(null);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal('');

  private rateService = inject(RateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRateDetail(+id);
    } else {
      this.error.set(true);
      this.errorMessage.set('ID de l\'avis non fourni');
    }
  }

  loadRateDetail(id: number): void {
    this.loading.set(true);
    this.error.set(false);

    this.rateService.getRateById(id).subscribe({
      next: (rate) => {
        this.rate.set(rate);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(true);
        this.errorMessage.set('Erreur lors du chargement de l\'avis');
        this.loading.set(false);
        console.error('Erreur lors du chargement de l\'avis:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/avis']);
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
      // Si c'est une string normale
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
}
