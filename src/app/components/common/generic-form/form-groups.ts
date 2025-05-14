// src/app/components/common/generic-form/form-groups.ts

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function createFormGroups(formBuilder: FormBuilder, steps: any[]): FormGroup[] {
    return steps.map((step) => {
        const group = formBuilder.group({});
        const columns = step.formConfig?.columns || [];
        columns.forEach((column: any) => {
            const fields = column.fields || [];
            fields.forEach((field: any) => {
                const validators = [];
                if (field.required) validators.push(Validators.required);
                if (field.pattern) validators.push(Validators.pattern(field.pattern));
                if (field.minLength) validators.push(Validators.minLength(field.minLength));
                group.addControl(field.name, formBuilder.control(field.defaultValue || '', validators));
            });
        });
        return group;
    });
}