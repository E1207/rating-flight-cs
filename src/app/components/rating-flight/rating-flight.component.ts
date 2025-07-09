import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RateService } from '../../services/rate.service';
import { Rate } from '../../models/rate.model';

@Component({
    selector: 'app-rating-flight',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './rating-flight.component.html',
    styleUrls: ['./rating-flight.component.scss']
})
export class RatingFlightComponent {
  reviewForm: FormGroup;
  submitted = signal(false);
  success = signal(false);
  loading = signal(false);
  rateService = inject(RateService);
  router = inject(Router);

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

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      flightNumber: ['', Validators.required],
      flightDate: ['', Validators.required],
      airline: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    effect(() => {
      if (this.success()) {
        setTimeout(() => {
          this.reviewForm.reset();
          this.submitted.set(false);
        }, 100);
      }
    });
  }

  onSubmit() {
    this.submitted.set(true);
    
    if (this.reviewForm.valid) {
      this.loading.set(true);
      this.success.set(false);

      const rateData: Rate = {
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment,
        flightNumber: this.reviewForm.value.flightNumber,
        company: this.reviewForm.value.airline,
        flightDate: this.reviewForm.value.flightDate,
        submittedAt: formatDate(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss', 'en-US')
      };

      this.rateService.createRate(rateData).subscribe({
        next: () => {
          this.success.set(true);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.success.set(false);
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.reviewForm.get(fieldName);
    if (field && field.invalid && (field.touched || this.submitted())) {
      if (field.errors?.['required']) {
        return 'Ce champ est obligatoire';
      }
      if (field.errors?.['min']) {
        return 'Veuillez donner une note';
      }
      if (field.errors?.['maxlength']) {
        return 'Commentaire trop long (maximum 1000 caractères)';
      }
    }
    return '';
  }

  goToRatingList(): void {
    this.router.navigate(['/avis']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
