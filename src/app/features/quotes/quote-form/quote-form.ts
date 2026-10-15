
import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss'
})
export class QuoteForm {
  submitted = false;
  estimatedAnnualPremium: number | null = null;

  insuranceTypes = [
    { label: 'Auto Insurance', value: 'auto' },
    { label: 'Home Insurance', value: 'home' },
    { label: 'Life Insurance', value: 'life' }
  ];

  quoteForm;

  constructor(private fb: FormBuilder) {
    this.quoteForm = this.fb.nonNullable.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      insuranceType: ['auto', Validators.required],
      coverageAmount: [50000, [
        Validators.required,
        Validators.min(10000),
        Validators.max(2000000)
      ]]
    });
  }

  get f() {
    return this.quoteForm.controls;
  }

  calculateQuote(): void {
    this.submitted = true;
    this.estimatedAnnualPremium = null;

    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const { insuranceType, coverageAmount } =
      this.quoteForm.getRawValue();

    // Illustrative rates for frontend development only.
    const sampleRates: Record<string, number> = {
      auto: 0.035,
      home: 0.0025,
      life: 0.004
    };

    this.estimatedAnnualPremium =
      Math.round(coverageAmount * sampleRates[insuranceType]);
  }

  resetForm(): void {
    this.quoteForm.reset({
      fullName: '',
      email: '',
      insuranceType: 'auto',
      coverageAmount: 50000
    });

    this.submitted = false;
    this.estimatedAnnualPremium = null;
  }
}
