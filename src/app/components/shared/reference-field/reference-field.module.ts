// src/app/components/shared/reference-field/reference-field.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceFieldComponent } from './reference-field.component';
import { ReferenceFieldModalComponent } from './reference-field-modal/reference-field-modal.component';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ...MATERIAL_STANDALONE_IMPORTS,
        ReferenceFieldComponent,
        ReferenceFieldModalComponent
    ],
    exports: [ReferenceFieldComponent],
})
export class ReferenceFieldModule { }
