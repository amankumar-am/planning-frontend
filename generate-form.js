const fs = require('fs');
const readline = require('readline');
const path = require('path');

// CLI prompt
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

function parseValidators(rawValidators) {
    const validators = [];
    rawValidators.split(',').forEach(v => {
        if (v === 'required') validators.push('Validators.required');
        else if (v.startsWith('minLength=')) validators.push(`Validators.minLength(${v.split('=')[1]})`);
        else if (v.startsWith('maxLength=')) validators.push(`Validators.maxLength(${v.split('=')[1]})`);
        else if (v.startsWith('min=')) validators.push(`Validators.min(${v.split('=')[1]})`);
        else if (v.startsWith('max=')) validators.push(`Validators.max(${v.split('=')[1]})`);
        else if (v === 'email') validators.push('Validators.email');
    });
    return validators;
}

function generateHtml(fields) {
    return fields.map(field => {
        return `
  <mat-form-field appearance="outline" class="full-width">
    <mat-label>${field.name.charAt(0).toUpperCase() + field.name.slice(1)}</mat-label>
    <input matInput type="${field.type}" formControlName="${field.name}" />
    ${field.validators.includes('Validators.required') ? `
    <mat-error *ngIf="formGroup.get('${field.name}')?.hasError('required')">
      ${field.name} is required
    </mat-error>` : ''}
    ${field.validators.includes('Validators.email') ? `
    <mat-error *ngIf="formGroup.get('${field.name}')?.hasError('email')">
      Invalid email
    </mat-error>` : ''}
  </mat-form-field>`;
    }).join('\n') + `
  <button mat-raised-button color="primary" type="submit" [disabled]="formGroup.invalid">
    Submit
  </button>`;
}

function generateTs(componentName, fields) {
    const formControls = fields.map(f => {
        const validators = f.validators.length ? `[${f.validators.join(', ')}]` : '[]';
        const defaultValue = f.type === 'number' ? 'null' : "''";
        return `${f.name}: [${defaultValue}, ${validators}]`;
    }).join(',\n      ');

    return `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-${componentName}',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.css']
})
export class ${capitalize(componentName)}Component implements OnInit {
  formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      ${formControls}
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      console.log('Form submitted:', this.formGroup.value);
    }
  }
}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

(async function main() {
    const formName = (await ask('Enter form name (e.g., user-profile): ')).trim();
    const rawFields = (await ask('Enter fields (name:type:validators), comma separated:\n> ')).trim();

    const fields = rawFields.split(',').map(fieldStr => {
        const [name, type, rawValidator = ''] = fieldStr.split(':');
        return {
            name,
            type,
            validators: parseValidators(rawValidator)
        };
    });

    const componentDir = path.join('src', 'app/components/forms', formName);
    if (!fs.existsSync(componentDir)) fs.mkdirSync(componentDir, { recursive: true });

    const htmlContent = `<form [formGroup]="formGroup" (ngSubmit)="onSubmit()">\n${generateHtml(fields)}\n</form>`;
    const tsContent = generateTs(formName, fields);
    const cssContent = `.full-width { width: 100%; margin-bottom: 16px; }`;

    fs.writeFileSync(path.join(componentDir, `${formName}.component.ts`), tsContent);
    fs.writeFileSync(path.join(componentDir, `${formName}.component.html`), htmlContent);
    fs.writeFileSync(path.join(componentDir, `${formName}.component.css`), cssContent);

    console.log(`✅ Form component "${formName}" generated successfully at src/app/${formName}/`);
    rl.close();
})();
