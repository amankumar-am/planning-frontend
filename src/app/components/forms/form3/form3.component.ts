// src/app/components/forms/form3/form3.component.ts

import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-form3',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form3.component.html',
  styleUrl: './form3.component.scss'
})
export class Form3Component {
  @Input() step3Group!: FormGroup;
  @Input() stepper!: MatStepper;

  goNext() {
    if (this.step3Group.valid) {
      this.stepper.next();
    }
  }

  goBack() {
    this.stepper.previous();
  }
}
