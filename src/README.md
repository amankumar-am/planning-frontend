# Planning Frontend - Form Validation Guide

## Validation Overview

This project uses Angular Reactive Forms and a custom validation message directive for consistent, maintainable form validation and error display.

### 1. Form Group/Control Definitions

- **Where:** Usually in your form builder logic (e.g., `form-groups.ts` or in your component).
- **What:** Add or update validators (e.g., `Validators.required`, `Validators.pattern`, etc.) for each field.
- **Example:**
  ```typescript
  group.addControl(field.name, formBuilder.control(field.defaultValue || "", validators));
  ```

### 2. Validation Message Directive

- **Where:** `src/app/directives/validation/validation-message.directive.ts`
- **What:** Update the `validationMessages` object to customize error messages for each field and error type.
- **Example:**
  ```typescript
  private validationMessages: { [key: string]: { [key: string]: string } } = {
    demand_workId: { required: 'Work ID is required.' },
    // ...
  };
  ```

### 3. Form Template

- **Where:** Your form component template (e.g., `generic-form.component.html`)
- **What:** Ensure you have a single error display logic for each field, e.g.:
  ```html
  <mat-error appValidationMessage [formGroup]="formGroup" [controlName]="field.name"></mat-error>
  ```

### 4. Custom Field Components

- **Where:** For custom fields like `reference-field`, ensure the value is set on the form control and validation is triggered.
- **What:** Update the form control value and trigger validation when a value is selected.

### 5. Global Styles (Optional)

- **Where:** In your global SCSS (e.g., `_material-overrides.scss`)
- **What:** Style `.mat-error` for consistent error message appearance.

---

## Other Instructions

- **Adding a New Field:**

  1. Add the field to your form config and form group definition.
  2. Add any required validators.
  3. Add a validation message in `validation-message.directive.ts` if needed.
  4. The error will automatically display in the form if you use the standard error directive.

- **Making the Form More Compact:**

  - Adjust spacing in global SCSS partials (`_form.scss`, `_material-overrides.scss`).
  - Use the provided compact settings for `.form-grid`, `.form-column`, `.compact-form-field`, `.mat-mdc-form-field-infix`, etc.

- **Custom Field Integration:**

  - Ensure custom fields update the form control value for validation and error display.
  - Use the same error directive for consistency.

- **Styling:**

  - All generic styles should be in global SCSS partials. Only use local SCSS for component-specific overrides.

- **Error Handling:**
  - All error messages are handled by the `appValidationMessage` directive for consistency.

---

## Summary Table

| Purpose               | File/Location                       | What to Update                         |
| --------------------- | ----------------------------------- | -------------------------------------- |
| Validators            | `form-groups.ts` or component TS    | Add/update validators                  |
| Error messages        | `validation-message.directive.ts`   | Update `validationMessages` object     |
| Error display in form | `generic-form.component.html`       | Use `<mat-error appValidationMessage>` |
| Custom field handling | e.g. `reference-field.component.ts` | Set value on form control              |
| Error styling         | `_material-overrides.scss`          | Style `.mat-error`                     |

---

For more details, see the code comments in each file or ask a team member.
