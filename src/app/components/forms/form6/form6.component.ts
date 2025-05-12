// src/app/components/forms/form6/form6.component.ts

import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-form6',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form6.component.html',
  styleUrl: './form6.component.scss'
})
export class Form6Component {
  @Input() step6Group!: FormGroup;
  @Input() stepper!: MatStepper;

  goNext() {
    if (this.step6Group.valid) {
      this.stepper.next();
    }
  }

  goBack() {
    this.stepper.previous();
  }
}
