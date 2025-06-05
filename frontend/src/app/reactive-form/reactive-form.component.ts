import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ShippingData} from "../shipping-data";

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './reactive-form.component.html',
  styleUrl: './reactive-form.component.css'
})
export class ReactiveFormComponent implements OnInit {
  shippingForm!: FormGroup;

  ngOnInit() {
    this.shippingForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''), // optional
      address1: new FormControl('', Validators.required),
      address2: new FormControl(''), // optional
      city: new FormControl('', Validators.required),
      postalCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}$/)
      ]),
      state: new FormControl('', Validators.required),
      shippingMethod: new FormControl('', Validators.required),
      trackingCode: new FormControl('', [Validators.required, this.createTrackingCodeValidator()]),
      isGiftWrap: new FormControl(false)
    });
  }

  onSubmit() {
    if (this.shippingForm.valid) {
      const shippingData: ShippingData = this.shippingForm.value;
      console.log('Form Submitted:', shippingData);

      alert('Form submitted successfully!');
      this.shippingForm.reset();
    }
  }

  createTrackingCodeValidator(): ValidatorFn {
    const regex = /^TRK-\d{4}-[A-Z]{4}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = regex.test(control.value);
      return valid ? null : { invalidTrackingCode: true };
    };
  }
}
