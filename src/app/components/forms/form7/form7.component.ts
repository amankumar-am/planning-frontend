// src/app/components/forms/form7/form7.component.ts

import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-form7',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form7.component.html',
  styleUrl: './form7.component.scss'
})
export class Form7Component {
  @Input() step7Group!: FormGroup;
  @Input() stepper!: MatStepper;

  goNext() {
    if (this.step7Group.valid) {
      this.stepper.next();
    }
  }

  goBack() {
    this.stepper.previous();
  }
}
