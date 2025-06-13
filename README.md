# Planning Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

# Reference Field Component Documentation

A powerful, reusable Angular component for handling reference data selection with advanced filtering, sorting, and dependency management capabilities.

## Table of Contents

1. [Reference Field Overview](#reference-field-overview)
2. [Basic Configuration](#basic-configuration)
3. [Properties Reference](#properties-reference)
4. [Advanced Features](#advanced-features)
5. [Real-World Examples from form1.config.ts](#real-world-examples-from-form1configts)
6. [Complete Examples](#complete-examples)
7. [Troubleshooting](#troubleshooting)

## Reference Field Overview

The Reference Field Component allows users to select data from external sources (APIs) through a modal interface. It supports:

- **Dynamic data loading** from configurable services
- **Custom display and value fields**
- **Advanced filtering** with multiple criteria
- **Flexible sorting** (ascending/descending)
- **Dependency management** (cascading dropdowns)
- **Type-safe configuration** with TypeScript interfaces

## Basic Configuration

### Minimal Setup

```typescript
{
  name: 'demand_officer',
  type: 'reference',
  label: 'Demand Officer',
  options: 'userProfiles'
}
```

### With Display and Value Fields

```typescript
{
  name: 'demand_officer',
  type: 'reference',
  label: 'Demand Officer',
  options: 'userProfiles',
  displayField: 'username',    // What users see
  valueField: 'id'            // What gets submitted
}
```

### With Multiple Display Fields (Concatenation)

```typescript
{
  name: 'demand_officer',
  type: 'reference',
  label: 'Demand Officer',
  options: 'userProfiles',
  displayField: ['firstName', 'lastName'],    // Concatenate multiple fields
  displayFieldSeparator: ' ',                 // Join with space (default)
  valueField: 'id'
}
```

### With Custom Separator

```typescript
{
  name: 'user_info',
  type: 'reference',
  label: 'User Information',
  options: 'userProfiles',
  displayField: ['username', 'department.name', 'designation.name'],
  displayFieldSeparator: ' - ',               // Join with " - "
  valueField: 'id'
}
```

## Properties Reference

### Core Properties

| Property  | Type          | Required | Default | Description                 |
| --------- | ------------- | -------- | ------- | --------------------------- |
| `name`    | `string`      | ✅       | -       | Form control name           |
| `type`    | `'reference'` | ✅       | -       | Field type identifier       |
| `label`   | `string`      | ✅       | -       | Display label for the field |
| `options` | `string`      | ✅       | -       | Service key from serviceMap |

### Display Properties

| Property                | Type                 | Required | Default  | Description                               |
| ----------------------- | -------------------- | -------- | -------- | ----------------------------------------- |
| `displayField`          | `string \| string[]` | ❌       | `'name'` | Field(s) to show in UI (single or array)  |
| `displayFieldSeparator` | `string`             | ❌       | `' '`    | Separator for concatenated fields (space) |
| `valueField`            | `string`             | ❌       | `'id'`   | Field to submit in form                   |

### Validation Properties

| Property   | Type      | Required | Default | Description               |
| ---------- | --------- | -------- | ------- | ------------------------- |
| `required` | `boolean` | ❌       | `false` | Whether field is required |

### Dependency Properties

| Property    | Type     | Required | Default | Description                     |
| ----------- | -------- | -------- | ------- | ------------------------------- |
| `dependsOn` | `string` | ❌       | `''`    | Parent field name for cascading |

### Filtering Properties

| Property  | Type     | Required | Default | Description            |
| --------- | -------- | -------- | ------- | ---------------------- |
| `filters` | `object` | ❌       | `{}`    | Filter criteria object |

### Sorting Properties

| Property    | Type              | Required | Default | Description           |
| ----------- | ----------------- | -------- | ------- | --------------------- |
| `sortBy`    | `string`          | ❌       | `''`    | Field name to sort by |
| `sortOrder` | `'asc' \| 'desc'` | ❌       | `'asc'` | Sort direction        |

### Conditional Properties

| Property      | Type     | Required | Default | Description                             |
| ------------- | -------- | -------- | ------- | --------------------------------------- |
| `conditional` | `string` | ❌       | `''`    | Show/hide logic (e.g., `'field:value'`) |

## Advanced Features

### 1. Field Concatenation

Reference fields support displaying multiple fields concatenated together, which is useful when you want to show comprehensive information in the selection dropdown.

#### Basic Concatenation

```typescript
{
  name: 'full_name_user',
  type: 'reference',
  label: 'Select User',
  options: 'userProfiles',
  displayField: ['firstName', 'lastName'],
  valueField: 'id'
}
```

**Result:** Displays "John Doe" instead of just "John" or "Doe"

#### With Custom Separator

```typescript
{
  name: 'detailed_user',
  type: 'reference',
  label: 'Select User',
  options: 'userProfiles',
  displayField: ['firstName', 'lastName', 'username'],
  displayFieldSeparator: ' | ',
  valueField: 'id'
}
```

**Result:** Displays "John Doe | johndoe123"

#### With Nested Fields

```typescript
{
  name: 'comprehensive_user',
  type: 'reference',
  label: 'Select User',
  options: 'userProfiles',
  displayField: ['firstName', 'lastName', 'department.name', 'designation.name'],
  displayFieldSeparator: ' - ',
  valueField: 'id'
}
```

**Result:** Displays "John Doe - Engineering - Senior Developer"

#### Common Use Cases

**Employee Selection with Department:**

```typescript
{
  name: 'employee',
  type: 'reference',
  label: 'Select Employee',
  options: 'userProfiles',
  displayField: ['firstName', 'lastName', 'employeeId'],
  displayFieldSeparator: ' (',
  valueField: 'id'
}
// Note: You might want to add closing parenthesis in a custom format
```

**Location with Hierarchy:**

```typescript
{
  name: 'location',
  type: 'reference',
  label: 'Select Location',
  options: 'villages',
  displayField: ['nameEn', 'taluka.nameEn', 'district.nameEn'],
  displayFieldSeparator: ', ',
  valueField: 'id'
}
```

**Result:** Displays "Village Name, Taluka Name, District Name"

#### Handling Empty Values

The concatenation automatically handles empty, null, or undefined values by filtering them out:

```typescript
{
  name: 'user_with_optional_fields',
  type: 'reference',
  label: 'Select User',
  options: 'userProfiles',
  displayField: ['firstName', 'middleName', 'lastName'],  // middleName might be empty
  displayFieldSeparator: ' ',
  valueField: 'id'
}
```

**Result:**

- If middleName exists: "John Michael Doe"
- If middleName is empty: "John Doe" (no extra spaces)

### 2. Filtering

Reference fields support multiple filter types with AND logic between different fields.

#### String Filters (Case-insensitive partial matching)

```typescript
{
  name: 'user_field',
  type: 'reference',
  options: 'userProfiles',
  filters: {
    firstName: 'john'  // Matches 'John', 'Johnny', 'Johnson'
  }
}
```

#### Boolean Filters (Exact matching)

```typescript
{
  name: 'active_users',
  type: 'reference',
  options: 'userProfiles',
  filters: {
    isActive: true  // Only active users
  }
}
```

#### Number Filters (Exact matching)

```typescript
{
  name: 'age_filter',
  type: 'reference',
  options: 'userProfiles',
  filters: {
    age: 25  // Users with age exactly 25
  }
}
```

#### Array Filters (Inclusion matching)

```typescript
{
  name: 'gender_filter',
  type: 'reference',
  options: 'userProfiles',
  filters: {
    gender: ['Male', 'Female']  // Users with gender in array
  }
}
```

#### Multiple Filters (AND logic)

```typescript
{
  name: 'complex_filter',
  type: 'reference',
  options: 'userProfiles',
  filters: {
    isActive: true,
    gender: 'Male',
    firstName: 'john'
  }
}
```

#### Nested Field Filters (Dot notation)

```typescript
{
  name: 'department_filter',
  type: 'reference',
  options: 'userProfiles',
  filters: {
    'department.name': 'Engineering',
    'office.location': 'Mumbai'
  }
}
```

### 3. Sorting

Control the order of items in the reference modal.

#### Basic Sorting

```typescript
{
  name: 'sorted_users',
  type: 'reference',
  options: 'userProfiles',
  sortBy: 'username',
  sortOrder: 'asc'
}
```

#### Descending Sort

```typescript
{
  name: 'reverse_sorted',
  type: 'reference',
  options: 'userProfiles',
  sortBy: 'dateOfJoining',
  sortOrder: 'desc'
}
```

#### Sort by Nested Fields

```typescript
{
  name: 'dept_sorted',
  type: 'reference',
  options: 'userProfiles',
  sortBy: 'department.name',
  sortOrder: 'asc'
}
```

### 4. Dependencies (Cascading Dropdowns)

Create parent-child relationships between reference fields.

```typescript
// Parent field
{
  name: 'demand_beneficiaryDistrict',
  type: 'reference',
  label: 'District',
  options: 'districts',
  displayField: 'nameEn',
  valueField: 'id'
},

// Child field (depends on district)
{
  name: 'demand_beneficiaryTaluka',
  type: 'reference',
  label: 'Taluka',
  options: 'talukas',
  dependsOn: 'demand_beneficiaryDistrict',  // 👈 Key property
  displayField: 'nameEn',
  valueField: 'id'
}
```

### 5. Conditional Display

Show/hide fields based on other field values.

```typescript
{
  name: 'demand_beneficiaryVillage',
  type: 'reference',
  label: 'Village',
  options: 'villages',
  conditional: 'demand_beneficiaryAreaType:village',  // Show only if area type is 'village'
  dependsOn: 'demand_beneficiaryTaluka'
}
```

## Real-World Examples from form1.config.ts

These examples are currently implemented in the actual form configuration:

### Example 1: Basic Officer Selection with Sorting

```typescript
{
  name: 'demand_officer',
  type: 'reference',
  label: 'Demand Officer',
  required: true,
  options: 'userProfiles',
  displayField: 'username',
  valueField: 'id',
  sortBy: 'username',
  sortOrder: 'asc'
}
```

**Result:** Displays all user profiles sorted alphabetically by username. Users see usernames in the selection modal, but the form submits the user ID.

### Example 2: Filtered Active Users for Assignment

```typescript
{
  name: 'demand_assignPSTo',
  type: 'reference',
  label: 'Assign PS To',
  required: true,
  options: 'userProfiles',
  displayField: 'firstName',
  valueField: 'id',
  filters: { isActive: true },
  sortBy: 'firstName',
  sortOrder: 'asc'
}
```

**Result:** Shows only active users, displays their first names, sorted alphabetically. Perfect for assignment scenarios where only active users should be selectable.

### Example 3: Implementation Officer with Descending Sort

```typescript
{
  name: 'demand_implementationOfficer',
  type: 'reference',
  label: 'Implementation Officer',
  required: true,
  options: 'userProfiles',
  displayField: 'username',
  valueField: 'id',
  filters: { isActive: true },
  sortBy: 'username',
  sortOrder: 'desc'
}
```

**Result:** Shows only active users, displays usernames, sorted in reverse alphabetical order (Z to A). Useful when you want recent or priority users to appear first.

### Example 4: Cascading Location Selection

```typescript
// Level 1: Sector
{
  name: 'demand_sector',
  type: 'reference',
  label: 'Sector',
  required: true,
  options: 'sectors',
  displayField: 'nameGu',
  valueField: 'id'
},

// Level 2: Sub-sector (depends on sector)
{
  name: 'demand_subSector',
  type: 'reference',
  label: 'Sub-Sector',
  required: true,
  options: 'subSectors',
  dependsOn: 'demand_sector',
  displayField: 'nameGu',
  valueField: 'id'
},

// Level 3: District
{
  name: 'demand_beneficiaryDistrict',
  type: 'reference',
  label: 'Beneficiary District',
  required: true,
  options: 'districts',
  displayField: 'nameGu',
  valueField: 'id'
},

// Level 4: Taluka (depends on district)
{
  name: 'demand_beneficiaryTaluka',
  type: 'reference',
  label: 'Beneficiary Taluka',
  required: true,
  options: 'talukas',
  dependsOn: 'demand_beneficiaryDistrict',
  displayField: 'nameGu',
  valueField: 'id'
}
```

**Result:** Creates a multi-level cascading dropdown system where:

- Selecting a sector filters available sub-sectors
- Selecting a district filters available talukas
- Each field resets when its parent changes

### Example 5: Conditional Village Selection

```typescript
// Radio button for area type
{
  name: 'demand_beneficiaryAreaType',
  type: 'radio',
  label: 'Beneficiary Area Type',
  required: true,
  options: ['urban', 'village']
},

// Village field (only shows for village areas)
{
  name: 'demand_beneficiaryVillage',
  type: 'reference',
  label: 'Beneficiary Village',
  conditional: 'demand_beneficiaryAreaType:village',
  options: 'villages',
  dependsOn: 'demand_beneficiaryTaluka',
  displayField: 'nameGu',
  valueField: 'id'
},

// Text field (only shows for urban areas)
{
  name: 'demand_beneficiaryNagarpalika',
  type: 'text',
  label: 'Beneficiary Nagarpalika',
  conditional: 'demand_beneficiaryAreaType:urban'
}
```

**Result:**

- User selects area type (urban/village)
- If "village" is selected, village dropdown appears
- If "urban" is selected, text field for Nagarpalika appears
- Village dropdown depends on selected taluka

## Complete Examples

### Example 1: Field Concatenation Examples

#### Full Name Display

```typescript
{
  name: 'assigned_officer',
  type: 'reference',
  label: 'Assigned Officer',
  required: true,
  options: 'userProfiles',
  displayField: ['firstName', 'lastName'],
  displayFieldSeparator: ' ',
  valueField: 'id',
  sortBy: 'firstName',
  sortOrder: 'asc'
}
```

**Result:** Shows "John Doe" instead of just "John", sorted by first name.

#### Comprehensive User Information

```typescript
{
  name: 'detailed_user',
  type: 'reference',
  label: 'Select User',
  required: true,
  options: 'userProfiles',
  displayField: ['firstName', 'lastName', 'username', 'department.name'],
  displayFieldSeparator: ' | ',
  valueField: 'id',
  filters: { isActive: true },
  sortBy: 'firstName'
}
```

**Result:** Shows "John Doe | johndoe123 | Engineering" for active users only.

#### Location Hierarchy

```typescript
{
  name: 'village_location',
  type: 'reference',
  label: 'Select Village',
  required: true,
  options: 'villages',
  displayField: ['nameEn', 'taluka.nameEn', 'district.nameEn'],
  displayFieldSeparator: ', ',
  valueField: 'id',
  dependsOn: 'selected_taluka',
  sortBy: 'nameEn'
}
```

**Result:** Shows "Village Name, Taluka Name, District Name" with proper hierarchy.

### Example 2: Basic User Selection

```typescript
{
  name: 'assigned_officer',
  type: 'reference',
  label: 'Assigned Officer',
  required: true,
  options: 'userProfiles',
  displayField: 'username',
  valueField: 'id',
  sortBy: 'username',
  sortOrder: 'asc'
}
```

**Result:** Shows a modal with all users, sorted by username, displaying usernames in the list.

### Example 3: Filtered Active Users Only

```typescript
{
  name: 'active_engineer',
  type: 'reference',
  label: 'Active Engineer',
  required: true,
  options: 'userProfiles',
  displayField: 'firstName',
  valueField: 'id',
  filters: {
    isActive: true,
    'department.name': 'Engineering'
  },
  sortBy: 'firstName',
  sortOrder: 'asc'
}
```

**Result:** Shows only active users from Engineering department, sorted by first name.

### Example 4: Multi-level Dependency Chain

```typescript
// Level 1: Sector
{
  name: 'demand_sector',
  type: 'reference',
  label: 'Sector',
  required: true,
  options: 'sectors',
  displayField: 'nameEn',
  valueField: 'id',
  sortBy: 'nameEn'
},

// Level 2: Sub-sector (depends on sector)
{
  name: 'demand_subSector',
  type: 'reference',
  label: 'Sub-Sector',
  required: true,
  options: 'subSectors',
  dependsOn: 'demand_sector',
  displayField: 'nameEn',
  valueField: 'id',
  sortBy: 'nameEn'
},

// Level 3: Category (depends on sub-sector)
{
  name: 'demand_category',
  type: 'reference',
  label: 'Category',
  required: true,
  options: 'categories',
  dependsOn: 'demand_subSector',
  displayField: 'nameEn',
  valueField: 'id',
  sortBy: 'nameEn'
}
```

**Result:** Creates a three-level cascading dropdown where each level depends on the previous selection.

### Example 5: Complex Filtering with Multiple Criteria

```typescript
{
  name: 'qualified_officer',
  type: 'reference',
  label: 'Qualified Officer',
  required: true,
  options: 'userProfiles',
  displayField: 'username',
  valueField: 'id',
  filters: {
    isActive: true,
    gender: ['Male', 'Female'],
    'employmentType.name': 'Permanent',
    'officerClass.level': ['Class-1', 'Class-2'],
    firstName: 'A'  // Names starting with 'A'
  },
  sortBy: 'username',
  sortOrder: 'desc'
}
```

**Result:** Shows only:

- Active users
- Any gender (Male or Female)
- Permanent employees
- Class-1 or Class-2 officers
- First names containing 'A'
- Sorted by username in descending order

### Example 6: Conditional Field with Dependencies

```typescript
{
  name: 'village_representative',
  type: 'reference',
  label: 'Village Representative',
  required: true,
  options: 'userProfiles',
  conditional: 'beneficiary_area_type:village',  // Only show for village areas
  dependsOn: 'selected_village',
  displayField: 'firstName',
  valueField: 'id',
  filters: {
    isActive: true,
    'designation.name': 'Village Representative'
  },
  sortBy: 'firstName'
}
```

**Result:**

- Only appears when area type is 'village'
- Resets when selected village changes
- Shows only active Village Representatives
- Sorted by first name

## Available Service Options

The `options` property maps to these available services:

| Option Key            | Service                      | Data Type          | Description                        |
| --------------------- | ---------------------------- | ------------------ | ---------------------------------- |
| `'financialYears'`    | FinancialYearUtilsService    | Financial Years    | Fiscal year data                   |
| `'funds'`             | FundUtilsService             | Funds              | Funding sources                    |
| `'sectors'`           | SectorUtilsService           | Sectors            | Government sectors                 |
| `'subSectors'`        | SubsectorUtilsService        | Sub-sectors        | Sector subdivisions                |
| `'districts'`         | DistrictUtilsService         | Districts          | Administrative districts           |
| `'talukas'`           | TalukaUtilsService           | Talukas            | Sub-district units                 |
| `'villages'`          | GpVillageUtilsService        | Villages           | Village data                       |
| `'beneficiaryGroups'` | BeneficiaryGroupUtilsService | Beneficiary Groups | Target groups                      |
| `'userProfiles'`      | UserProfileUtilsService      | User Profiles      | System users                       |
| `'officerClasses'`    | OfficerClassUtilsService     | Officer Classes    | Government officer classifications |
| `'departments'`       | DepartmentUtilsService       | Departments        | Government departments             |
| `'employmentTypes'`   | EmploymentTypeUtilsService   | Employment Types   | Employment categories              |
| `'designations'`      | DesignationUtilsService      | Designations       | Job designations                   |
| `'offices'`           | OfficeUtilsService           | Offices            | Office locations                   |
| `'officeLevels'`      | OfficeLevelUtilsService      | Office Levels      | Administrative levels              |
| `'states'`            | StateUtilsService            | States             | State data                         |
| `'mpmlas'`            | MpmlaUtilsService            | MP/MLAs            | Elected representatives            |
| `'prants'`            | PrantUtilsService            | Prants             | Regional divisions                 |

## TypeScript Interface

For better type safety and IntelliSense support:

```typescript
export interface ReferenceFieldConfig {
  name: string;
  type: "reference";
  label: string;
  required?: boolean;
  options: string;
  displayField?: string | string[]; // Single field or array for concatenation
  displayFieldSeparator?: string; // Separator for concatenated fields
  valueField?: string;
  dependsOn?: string;
  filters?: { [key: string]: any };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  conditional?: string;
}
```

## Troubleshooting

### Common Issues

#### 1. "No service found for optionsKey" Error

**Problem:** Invalid service key in `options`
**Solution:** Use one of the valid service keys from the Available Service Options table

#### 2. "Could not find column with id" Error

**Problem:** Mismatch between schema column names and actual data field names
**Solution:** Check if the service properly maps database columns to JSON field names

#### 3. Empty Modal / No Data

**Problem:** Filters are too restrictive or dependency not selected
**Solution:**

- Check filter criteria
- Ensure parent fields are selected for dependent fields
- Verify API is returning data

#### 4. Sorting Not Working

**Problem:** Sort field doesn't exist in data
**Solution:** Verify the `sortBy` field name matches actual data fields

#### 5. Dependencies Not Updating

**Problem:** Parent-child relationship not configured correctly
**Solution:**

- Ensure `dependsOn` matches exact parent field name
- Check that parent field has `valueField` configured
- Verify parent service sets dependency ID correctly

### Best Practices

1. **Always specify `displayField` and `valueField`** for clarity
2. **Use meaningful field names** that reflect the data purpose
3. **Test filter combinations** to ensure they work as expected
4. **Keep dependency chains reasonable** (max 3-4 levels)
5. **Use TypeScript interfaces** for better development experience
6. **Document complex filter logic** in comments

#### Field Concatenation Best Practices

7. **Choose appropriate separators** based on the data type:

   - Use `' '` (space) for names: "John Doe"
   - Use `', '` (comma-space) for locations: "Village, Taluka, District"
   - Use `' - '` (dash) for detailed info: "John Doe - Engineering - Manager"
   - Use `' | '` (pipe) for distinct categories: "Username | Department | Role"

8. **Order fields logically** in the array:

   - Most important information first
   - Follow natural reading patterns (firstName before lastName)
   - Consider hierarchy (broader to specific: District, Taluka, Village)

9. **Handle optional fields gracefully**:

   - Place optional fields in the middle or end of the array
   - The system automatically filters out empty values

10. **Test with real data** to ensure concatenated strings are readable and not too long

11. **Consider mobile display** - longer concatenated strings may be truncated on smaller screens

### Performance Tips

1. **Use specific filters** to reduce data load
2. **Limit dependency depth** to avoid cascading API calls
3. **Cache frequently used reference data** at service level
4. **Consider pagination** for large datasets (future enhancement)

## Future Enhancements

Planned features for future versions:

- [ ] **Client-side pagination** for large datasets
- [ ] **Search functionality** within modals
- [ ] **Multi-select capability** for array values
- [ ] **Custom filter functions** for complex logic
- [ ] **Async filter validation** with debouncing
- [ ] **Export/Import** of filter configurations
- [ ] **Template-based filtering** for common use cases

---

**Need Help?** Check the troubleshooting section or refer to the complete examples above.
