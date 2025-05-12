// src/app/components/forms/form9/form9.component.ts

import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-form9',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form9.component.html',
  styleUrl: './form9.component.scss'
})
export class Form9Component {
  @Input() step9Group!: FormGroup;
  @Input() stepper!: MatStepper;

  goNext() {
    if (this.step9Group.valid) {
      this.stepper.next();
    }
  }

  goBack() {
    this.stepper.previous();
  }
}
