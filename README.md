# Planning Frontend

A comprehensive Angular application for government planning and project management with advanced form handling, reference field components, and multilingual support.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test
```

The application will be available at `http://localhost:4200/`.

## Project Overview

This Angular 19 application provides:

- **Dynamic Form System** with configurable fields and validation
- **Reference Field Components** for data selection with filtering and sorting
- **Cascading Dropdowns** with dependency management
- **Multilingual Support** (English/Gujarati)
- **Backend Query Integration** with filtering, sorting, and pagination
- **Responsive Design** with Material UI components

## Key Features

### 1. Reference Field Component

A powerful, reusable component for handling reference data selection:

```typescript
{
  name: 'demand_officer',
  type: 'reference',
  label: 'Demand Officer',
  options: 'userProfiles',
  displayField: ['firstName', 'lastName'],
  displayFieldSeparator: ' ',
  valueField: 'id',
  filters: { isActive: true },
  sortBy: 'firstName',
  sortOrder: 'asc'
}
```

**Features:**

- Dynamic data loading from configurable services
- Custom display and value fields
- Field concatenation with custom separators
- Advanced filtering with multiple criteria
- Flexible sorting (ascending/descending)
- Dependency management (cascading dropdowns)
- Backend query integration

### 2. Default Values for Reference Fields

Enhanced default value system supporting both simple values and object-based specifications:

```typescript
// Simple value (backward compatible)
{ defaultValue: 'mehsana' }

// Object-based field/value specification
{ defaultValue: { nameEn: 'Mehsana' } }
{ defaultValue: { nameGu: 'મહેસાણા' } }

// Multiple field fallback
{ defaultValue: { nameEn: 'Mehsana', nameGu: 'મહેસાણા', code: 'MHS' } }
```

### 3. Form Validation System

Consistent validation using Angular Reactive Forms with custom directive:

```html
<mat-error appValidationMessage [formGroup]="formGroup" [controlName]="field.name"></mat-error>
```

**Validation Features:**

- Custom validation message directive
- Field-specific error messages
- Consistent error display across all components
- Integration with reference fields

### 4. Backend Query System

Efficient data loading with backend filtering, sorting, and pagination:

```typescript
// Query options automatically built from field configuration
{
  filters: [
    { field: 'isActive', operator: 'eq', value: true },
    { field: 'department', operator: 'eq', value: 'Engineering' }
  ],
  sortBy: 'firstName',
  sortOrder: 'asc',
  page: 1,
  limit: 50
}
```

## Form Configuration

### Basic Field Types

```typescript
export const formConfig = {
  columns: [
    {
      fields: [
        // Text field
        { name: "workId", type: "text", label: "Work ID", required: true },

        // Number field
        { name: "amount", type: "number", label: "Amount", required: true },

        // Date field
        { name: "requestDate", type: "date", label: "Request Date", required: true },

        // Textarea
        { name: "description", type: "textarea", label: "Description", minLength: 10 },

        // Checkbox
        { name: "isTrust", type: "checkbox", label: "Trust?", defaultValue: false },

        // Radio buttons
        { name: "areaType", type: "radio", label: "Area Type", options: ["urban", "village"] },
      ],
    },
  ],
};
```

### Reference Field Examples

```typescript
// Basic reference field
{
  name: 'demand_officer',
  type: 'reference',
  label: 'Demand Officer',
  options: 'userProfiles',
  displayField: 'username',
  valueField: 'id'
}

// With field concatenation
{
  name: 'assigned_officer',
  type: 'reference',
  label: 'Assigned Officer',
  options: 'userProfiles',
  displayField: ['firstName', 'lastName', 'username'],
  displayFieldSeparator: ' - ',
  valueField: 'id'
}

// With filtering and sorting
{
  name: 'active_engineer',
  type: 'reference',
  label: 'Active Engineer',
  options: 'userProfiles',
  displayField: 'firstName',
  valueField: 'id',
  filters: { isActive: true, 'department.name': 'Engineering' },
  sortBy: 'firstName',
  sortOrder: 'asc'
}

// With dependencies (cascading dropdown)
{
  name: 'demand_beneficiaryTaluka',
  type: 'reference',
  label: 'Beneficiary Taluka',
  options: 'talukas',
  dependsOn: 'demand_beneficiaryDistrict',
  displayField: 'nameGu',
  valueField: 'id'
}

// With conditional display
{
  name: 'demand_beneficiaryVillage',
  type: 'reference',
  label: 'Beneficiary Village',
  conditional: 'demand_beneficiaryAreaType:village',
  options: 'villages',
  dependsOn: 'demand_beneficiaryTaluka',
  displayField: 'nameGu',
  valueField: 'id'
}

// With default values
{
  name: 'demand_beneficiaryDistrict',
  type: 'reference',
  label: 'Beneficiary District',
  options: 'districts',
  displayField: 'nameGu',
  valueField: 'id',
  defaultValue: { nameEn: 'Mehsana' }
}
```

## Available Services

| Service Key        | Data Type       | Description                       |
| ------------------ | --------------- | --------------------------------- |
| `'userProfiles'`   | User Profiles   | System users and officers         |
| `'districts'`      | Districts       | Administrative districts          |
| `'talukas'`        | Talukas         | Sub-district administrative units |
| `'villages'`       | Villages        | Village/GP data                   |
| `'sectors'`        | Sectors         | Government sectors                |
| `'subSectors'`     | Sub-sectors     | Sector subdivisions               |
| `'funds'`          | Funds           | Funding sources                   |
| `'financialYears'` | Financial Years | Fiscal year data                  |
| `'departments'`    | Departments     | Government departments            |
| `'designations'`   | Designations    | Job designations                  |
| `'offices'`        | Offices         | Office locations                  |
| `'mpmlas'`         | MP/MLAs         | Elected representatives           |

## Development Guidelines

### Adding New Fields

1. **Add to form configuration:**

   ```typescript
   { name: 'newField', type: 'text', label: 'New Field', required: true }
   ```

2. **Add validation messages (if needed):**

   ```typescript
   // In validation-message.directive.ts
   private validationMessages = {
     newField: { required: 'New Field is required.' }
   };
   ```

3. **Use standard error directive:**
   ```html
   <mat-error appValidationMessage [formGroup]="formGroup" [controlName]="field.name"></mat-error>
   ```

### Adding New Reference Services

1. **Create service in appropriate directory**
2. **Implement BaseReferenceUtilsService**
3. **Add to service map in GenericFormComponent**
4. **Configure backend query support (optional)**

### Form Validation Best Practices

- Use the `appValidationMessage` directive for consistent error display
- Define field-specific validation messages in `validation-message.directive.ts`
- Ensure custom components update form control values properly
- Use global SCSS for styling, local SCSS only for component-specific overrides

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── common/
│   │   │   ├── generic-form/          # Main form component
│   │   │   └── generic-table/         # Data table component
│   │   ├── shared/
│   │   │   └── reference-field/       # Reference field component
│   │   └── forms-config/              # Form configurations
│   ├── services/
│   │   ├── utils/                     # Reference utility services
│   │   └── [entity]/                  # Entity-specific services
│   ├── models/                        # TypeScript interfaces
│   ├── core/                          # Core utilities (QueryHelper)
│   └── directives/                    # Custom directives
```

## Backend Integration

The application integrates with a backend API supporting structured filtering, pagination, sorting, and relations. Query options are automatically built from field configurations and sent to backend endpoints for efficient data loading.

## Troubleshooting

### Common Issues

**"No service found for optionsKey" Error:**

- Check that the service key exists in the service map
- Verify the service is properly imported and injected

**Empty Modal/No Data:**

- Check filter criteria are not too restrictive
- Ensure parent fields are selected for dependent fields
- Verify API is returning data

**Dependencies Not Updating:**

- Ensure `dependsOn` matches exact parent field name
- Check that parent field has `valueField` configured
- Verify parent service sets dependency ID correctly

**Default Values Not Working:**

- Check that the default value format matches available data
- Use object-based specification for precise matching
- Check console for debug messages about matching attempts

## Contributing

1. Follow the established patterns for form configuration
2. Use TypeScript interfaces for type safety
3. Add validation messages for new fields
4. Test with real data to ensure proper functionality
5. Document complex configurations with comments

## Build and Deployment

```bash
# Development build
ng build

# Production build
ng build --configuration production

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/planning-frontend/stats.json
```

## Backend Query Implementation Status

### ✅ COMPLETE: All Services Now Support Backend Queries

**Implementation Summary:**

- **18/18 services** now have full backend query support
- All services implement `fetchItemsWithQuery()` override methods
- All main services have `/query` endpoints with QueryHelper integration
- Automatic fallback to frontend filtering if backend queries fail
- Consistent query interface across all services

**Services with Full Backend Query Support:**

**Core Reference Services:**

- ✅ UserProfileUtilsService - Complete with schema defaults
- ✅ SectorUtilsService - Full filtering, sorting, pagination
- ✅ DistrictUtilsService - Full filtering, sorting, pagination
- ✅ FundUtilsService - Full filtering, sorting, pagination
- ✅ FinancialYearUtilsService - Full filtering, sorting, pagination
- ✅ DepartmentUtilsService - Full filtering, sorting, pagination
- ✅ DesignationUtilsService - Full filtering, sorting, pagination
- ✅ OfficeUtilsService - Full filtering, sorting, pagination
- ✅ OfficeLevelUtilsService - Full filtering, sorting, pagination
- ✅ StateUtilsService - Full filtering, sorting, pagination
- ✅ MpmlaUtilsService - Full filtering, sorting, pagination
- ✅ PrantUtilsService - Full filtering, sorting, pagination
- ✅ OfficerClassUtilsService - Full filtering, sorting, pagination
- ✅ EmploymentTypeUtilsService - Full filtering, sorting, pagination
- ✅ BeneficiaryGroupUtilsService - Full filtering, sorting, pagination
- ✅ AcUtilsService - Full filtering, sorting, pagination

**Dependency-Based Services:**

- ✅ SubsectorUtilsService - Backend support with sector dependency
- ✅ TalukaUtilsService - Backend support with district dependency
- ✅ GpVillageUtilsService - Backend support with taluka dependency

**Performance Benefits:**

- 🚀 Reduced memory usage - only loads required data
- ⚡ Faster load times - server-side filtering reduces network transfer
- 📱 Better UX - pagination and search provide responsive experience
- 📈 Scalability - handles large datasets efficiently

**Query Features:**

- **Filter Operators**: eq, like, in, gte, lte, ne, isNull, isNotNull
- **Sorting**: ASC/DESC with multiple field support
- **Pagination**: Configurable page size and navigation
- **Search**: Global search across searchable fields
- **Relations**: Support for nested object filtering

---

**Status**: ✅ Complete Backend Query Implementation  
**Last Updated**: December 2024  
**Build Status**: ✅ All services compile successfully

**For detailed examples and advanced usage, refer to the form configurations in `src/app/components/forms-config/`.**
