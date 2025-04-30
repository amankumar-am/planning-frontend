import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-form4',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form4.component.html',
  styleUrl: './form4.component.css'
})
export class Form4Component {
  @Input() step4Group!: FormGroup;
  @Input() stepper!: MatStepper;

  goNext() {
    if (this.step4Group.valid) {
      this.stepper.next();
    }
  }

  goBack() {
    this.stepper.previous();
  }
}
