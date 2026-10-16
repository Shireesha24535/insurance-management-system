
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

      // Auto insurance fields
      vehicleValue: [500000],
      vehicleAge: [3],
      autoCoveragePlan: ['comprehensive'],

      // Home insurance fields
      propertyValue: [5000000],
      propertyType: ['independent'],
      homeCoveragePlan: ['building-and-contents'],

      // Life insurance fields
      applicantAge: [30],
      lifeCover: [2500000],
      policyTerm: [20]
    });

    this.configureValidators('auto');

    this.quoteForm.controls.insuranceType.valueChanges
      .subscribe(type => {
        this.configureValidators(type);
        this.estimatedAnnualPremium = null;
        this.submitted = false;
      });
  }

  get f() {
    return this.quoteForm.controls;
  }

  private configureValidators(type: string): void {
    const controls = this.quoteForm.controls;

    // Clear validators from fields that may be hidden.
    const optionalControls = [
      controls.vehicleValue,
      controls.vehicleAge,
      controls.autoCoveragePlan,
      controls.propertyValue,
      controls.propertyType,
      controls.homeCoveragePlan,
      controls.applicantAge,
      controls.lifeCover,
      controls.policyTerm
    ];

    optionalControls.forEach(control => {
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    });

    const requiredNumber = [
      Validators.required,
      Validators.min(1)
    ];

    if (type === 'auto') {
      controls.vehicleValue.setValidators([
        Validators.required,
        Validators.min(50000),
        Validators.max(100000000)
      ]);

      controls.vehicleAge.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(25)
      ]);

      controls.autoCoveragePlan.setValidators(
        Validators.required
      );
    }

    if (type === 'home') {
      controls.propertyValue.setValidators([
        Validators.required,
        Validators.min(500000),
        Validators.max(1000000000)
      ]);

      controls.propertyType.setValidators(
        Validators.required
      );

      controls.homeCoveragePlan.setValidators(
        Validators.required
      );
    }

    if (type === 'life') {
      controls.applicantAge.setValidators([
        Validators.required,
        Validators.min(18),
        Validators.max(65)
      ]);

      controls.lifeCover.setValidators([
        Validators.required,
        Validators.min(100000),
        Validators.max(50000000)
      ]);

      controls.policyTerm.setValidators([
        Validators.required,
        Validators.min(5),
        Validators.max(40)
      ]);
    }

    // Refresh validation for all product-specific fields.
    optionalControls.forEach(control => {
      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  calculateQuote(): void {
    this.submitted = true;
    this.estimatedAnnualPremium = null;

    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const data = this.quoteForm.getRawValue();
    let premium = 0;

    // These formulas are illustrative demo assumptions only.
    switch (data.insuranceType) {
      case 'auto': {
        const planMultiplier =
          data.autoCoveragePlan === 'comprehensive' ? 1.4 : 1;

        const ageMultiplier =
          1 + data.vehicleAge * 0.015;

        premium =
          data.vehicleValue * 0.02 *
          planMultiplier * ageMultiplier;

        break;
      }

      case 'home': {
        const propertyMultiplier =
          data.propertyType === 'apartment' ? 0.8 : 1;

        const planMultiplier =
          data.homeCoveragePlan === 'building-and-contents'
            ? 1.3
            : 1;

        premium =
          data.propertyValue * 0.001 *
          propertyMultiplier * planMultiplier;

        break;
      }

      case 'life': {
        const ageMultiplier =
          1 + (data.applicantAge - 18) * 0.025;

        const termMultiplier =
          1 + (data.policyTerm - 5) * 0.015;

        premium =
          data.lifeCover * 0.001 *
          ageMultiplier * termMultiplier;

        break;
      }
    }

    this.estimatedAnnualPremium = Math.round(premium);
  }

  resetForm(): void {
    this.quoteForm.reset({
      fullName: '',
      email: '',
      insuranceType: 'auto',
      vehicleValue: 500000,
      vehicleAge: 3,
      autoCoveragePlan: 'comprehensive',
      propertyValue: 5000000,
      propertyType: 'independent',
      homeCoveragePlan: 'building-and-contents',
      applicantAge: 30,
      lifeCover: 2500000,
      policyTerm: 20
    });

    this.configureValidators('auto');
    this.submitted = false;
    this.estimatedAnnualPremium = null;
  }
}
