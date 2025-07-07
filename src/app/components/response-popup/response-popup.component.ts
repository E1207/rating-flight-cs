import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() isVisible = false;
  @Input() rateId: number | null = null;
  @Input() flightNumber = '';
  @Input() company = '';
  @Output() closePopup = new EventEmitter<void>();
  @Output() responseAdded = new EventEmitter<RateResponse>();

  responseForm: FormGroup;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private rateResponseService: RateResponseService
  ) {
    this.responseForm = this.fb.group({
      response: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.responseForm.valid && this.rateId) {
      this.isSubmitting = true;
      this.error = '';

      const responseText = this.responseForm.value.response;

      this.rateResponseService.createResponse(this.rateId, responseText).subscribe({
        next: (newResponse) => {
          this.responseAdded.emit(newResponse);
          this.closePopup.emit();
          this.responseForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.error = 'Erreur lors de l\'envoi de la réponse. Veuillez réessayer.';
          this.isSubmitting = false;
          console.error('Erreur lors de la création de la réponse:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.closePopup.emit();
    this.responseForm.reset();
    this.error = '';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
