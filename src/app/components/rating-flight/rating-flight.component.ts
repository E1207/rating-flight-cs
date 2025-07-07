import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RateService } from '../../services/rate.service';
import { Rate } from '../../models/rate.model';
import { Flight } from '../../models/flight.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-rating-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './rating-flight.component.html',
  styleUrls: ['./rating-flight.component.scss']
})
export class RatingFlightComponent {
  reviewForm: FormGroup;
  submitted = false;
  success = false;
  loading = false;

  airlines = [
    'Air France',
    'Lufthansa', 
    'British Airways',
    'KLM',
    'Emirates',
    'Qatar Airways',
    'Turkish Airlines',
    'Swiss International',
    'Alitalia',
    'Iberia'
  ];

  constructor(private fb: FormBuilder, private rateService: RateService, private router: Router) {
    this.reviewForm = this.fb.group({
      flightNumber: ['', Validators.required],
      flightDate: ['', Validators.required],
      airline: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.submitted = true;
      this.loading = true;
      this.success = false;

      const rateData: Rate = {
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment,
        flightNumber: this.reviewForm.value.flightNumber,
        company: this.reviewForm.value.airline,
        flightDate: this.reviewForm.value.flightDate,
        submittedAt: formatDate(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss', 'en-US')
      };

      this.rateService.createRate(rateData).subscribe({
        next: (response) => {
          this.success = true;
          this.loading = false;
          this.reviewForm.reset();
          this.submitted = false;
          console.log('Avis sauvegardé avec succès:', response);
        },
        error: (error) => {
          this.loading = false;
          this.success = false;
          console.error('Erreur lors de la sauvegarde:', error);
          console.log('Date de soumission:', formatDate(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss', 'en-US'));
        }
      });
    } else {
      this.submitted = true;
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.reviewForm.controls).forEach(key => {
        this.reviewForm.get(key)?.markAsTouched();
      });
    }
  }

  // Méthode pour vérifier si un champ a une erreur
  hasError(fieldName: string): boolean {
    const field = this.reviewForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  // Méthode pour obtenir le message d'erreur d'un champ
  getErrorMessage(fieldName: string): string {
    const field = this.reviewForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (field.errors['min']) {
        return 'La note doit être au minimum de 1';
      }
      if (field.errors['max']) {
        return 'La note doit être au maximum de 5';
      }
      if (field.errors['maxlength']) {
        return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
      }
    }
    return '';
  }

  // Méthode pour naviguer vers la liste des avis
  goToRatingList(): void {
    this.router.navigate(['/avis']);
  }
}
