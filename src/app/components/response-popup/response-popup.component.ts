import { CommonModule } from '@angular/common';
import { Component, signal, inject, effect, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RateResponseService } from '../../services/rate-response.service';
import { RateResponse } from '../../models/RateResponse.model';

@Component({
    selector: 'app-response-popup',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './response-popup.component.html',
    styleUrls: ['./response-popup.component.scss']
})
export class ResponsePopupComponent {
  isVisible = signal(false);
  rateId = signal<number | null>(null);
  flightNumber = signal('');
  company = signal('');
  
  closePopup = output<void>();
  responseAdded = output<{response: RateResponse, rateId: number}>();

  responseForm: FormGroup;
  isSubmitting = signal(false);
  error = signal('');

  private fb = inject(FormBuilder);
  private rateResponseService = inject(RateResponseService);

  constructor() {
    this.responseForm = this.fb.group({
      response: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });

    effect(() => {
      if (!this.isVisible()) {
        this.responseForm.reset();
        this.error.set('');
        this.isSubmitting.set(false);
      }
    });
  }

  show(rateId: number, flightNumber: string, company: string): void {
    this.rateId.set(rateId);
    this.flightNumber.set(flightNumber);
    this.company.set(company);
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }

  onSubmit(): void {
    if (this.responseForm.valid && this.rateId()) {
      this.isSubmitting.set(true);
      this.error.set('');

      const responseText = this.responseForm.value.response;

      this.rateResponseService.createResponse(this.rateId()!, responseText).subscribe({
        next: (newResponse) => {
          this.responseAdded.emit({response: newResponse, rateId: this.rateId()!});
          this.closePopup.emit();
          this.responseForm.reset();
          this.isSubmitting.set(false);
        },
        error: (error) => {
          this.error.set('Erreur lors de l\'envoi de la réponse. Veuillez réessayer.');
          this.isSubmitting.set(false);
          console.error('Erreur lors de la création de la réponse:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.closePopup.emit();
    this.responseForm.reset();
    this.error.set('');
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
