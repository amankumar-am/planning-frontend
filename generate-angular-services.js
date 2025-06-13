// generate-angular-services.js

const fs = require('fs');
const path = require('path');

// Utility to capitalize the first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Utility to convert entity name to kebab-case (e.g., FinancialYear -> financial-year)
const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
};

// Common fields for all models
const commonFields = `
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
`;

// List of common field names to exclude from specific fields
const commonFieldNames = ['isActive', 'createdBy', 'createdAt', 'modifiedBy', 'modifiedAt'];

// Parse entity code to extract fields
const parseEntityFields = (entityCode) => {
  // Match fields with decorators, capturing field name and type
  const fieldRegex = /@[\w\s({',:})]+\s+(\w+)(!|\?)?:\s*(\w+);/g;
  const fields = [];
  let match;

  while ((match = fieldRegex.exec(entityCode)) !== null) {
    const fieldName = match[1];
    let fieldType = match[3];

    // Map TypeScript types to Angular model types
    if (fieldType === 'number') fieldType = 'number';
    else if (fieldType === 'string') fieldType = 'string';
    else if (fieldType === 'Date') fieldType = 'Date';
    else if (fieldType === 'boolean') fieldType = 'boolean';
    else fieldType = 'any'; // Fallback for unrecognized types

    fields.push({ name: fieldName, type: fieldType });
  }

  // Format fields for the main interface (all fields)
  const allFields = fields
    .map((field) => `    ${field.name}: ${field.type};`)
    .join('\n');

  // Format fields for CreateDto (isActive, createdBy, etc.)
  const createDtoFields = fields
    .filter((field) => ![...commonFieldNames].includes(field.name))
    .map((field) => `    ${field.name}: ${field.type};`)
    .join('\n');

  return { allFields, createDtoFields };
};

// Template for <entity>-utils.service.ts
const utilsServiceTemplate = (entity, entityKebab, entityCapitalized) => `
import { Injectable } from '@angular/core';
import { ${entityCapitalized}Service } from './${entityKebab}.service';
import { ${entityCapitalized} } from '../../models/${entityKebab}.model';
import { BaseReferenceUtilsService, ReferenceSchema } from '../BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ${entityCapitalized}UtilsService extends BaseReferenceUtilsService<${entityCapitalized}> {
    constructor(private ${entity}Service: ${entityCapitalized}Service) {
        super();
        this.labelField = '${entityCapitalized}';
    }

    protected async fetchAllItems(): Promise<{ data: ${entityCapitalized}[]; schema: ReferenceSchema<${entityCapitalized}>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.${entity}Service.getAll${entityCapitalized}s());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
`;

// Template for <entity>.service.ts
const serviceTemplate = (entity, entityKebab, entityCapitalized) => `
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { Create${entityCapitalized}Dto, ${entityCapitalized}, Update${entityCapitalized}Dto } from '../../models/${entityKebab}.model';

@Injectable({
  providedIn: 'root'
})
export class ${entityCapitalized}Service {
  private apiUrl = \`\${environment.apiBaseUrl}/${entityKebab}s\`;

  constructor(private http: HttpClient) { }

  // Get all ${entityKebab}s
  getAll${entityCapitalized}s(): Observable<ReferenceDataResponse<${entityCapitalized}>> {
    return this.http.get<ReferenceDataResponse<${entityCapitalized}>>(this.apiUrl);
  }

  // Get ${entityKebab} by ID
  get${entityCapitalized}ById(id: number): Observable<${entityCapitalized}> {
    return this.http.get<${entityCapitalized}>(\`\${this.apiUrl}/\${id}\`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new ${entityKebab}
  create${entityCapitalized}(${entity}: Create${entityCapitalized}Dto): Observable<${entityCapitalized}> {
    return this.http.post<${entityCapitalized}>(this.apiUrl, ${entity}).pipe(
      catchError(this.handleError)
    );
  }

  // Update ${entityKebab}
  update${entityCapitalized}(id: number, ${entity}: Update${entityCapitalized}Dto): Observable<${entityCapitalized}> {
    return this.http.put<${entityCapitalized}>(\`\${this.apiUrl}/\${id}\`, ${entity}).pipe(
      catchError(this.handleError)
    );
  }

  // Delete ${entityKebab}
  delete${entityCapitalized}(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = \`Error: \${error.error.message}\`;
    } else {
      // Server-side error
      errorMessage = \`Error Code: \${error.status}\\nMessage: \${error.error.message || error.message}\`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
`;

// Template for <entity>.model.ts
const modelTemplate = (entityCapitalized, allFields, createDtoFields) => `
export interface ${entityCapitalized} {
${allFields}${commonFields}}

export interface Create${entityCapitalized}Dto {
${createDtoFields}    isActive?: boolean;
}

export interface Update${entityCapitalized}Dto extends Partial<Create${entityCapitalized}Dto> {
    modifiedBy: string;
    modifiedAt: Date;
}
`;

// Main function to generate files
const generateFiles = (entity, entityCode, projectPath) => {
  const entityCapitalized = capitalize(entity);
  const entityKebab = toKebabCase(entityCapitalized);
  const servicesPath = path.join(projectPath, 'src', 'app', 'services', entityKebab);
  const modelsPath = path.join(projectPath, 'src', 'app', 'models');

  // Parse fields from entity code
  const { allFields, createDtoFields } = parseEntityFields(entityCode);

  // Create services/<entity> directory if it doesn't exist
  if (!fs.existsSync(servicesPath)) {
    fs.mkdirSync(servicesPath, { recursive: true });
  }

  // Create models directory if it doesn't exist
  if (!fs.existsSync(modelsPath)) {
    fs.mkdirSync(modelsPath, { recursive: true });
  }

  // Generate <entity>-utils.service.ts
  fs.writeFileSync(
    path.join(servicesPath, `${entityKebab}-utils.service.ts`),
    utilsServiceTemplate(entity, entityKebab, entityCapitalized)
  );

  // Generate <entity>.service.ts
  fs.writeFileSync(
    path.join(servicesPath, `${entityKebab}.service.ts`),
    serviceTemplate(entity, entityKebab, entityCapitalized)
  );

  // Generate <entity>.model.ts
  fs.writeFileSync(
    path.join(modelsPath, `${entityKebab}.model.ts`),
    modelTemplate(entityCapitalized, allFields, createDtoFields)
  );

  console.log(`Generated files for ${entityCapitalized} in ${servicesPath} and ${modelsPath}`);
};

// Example usage for fund
const entity = 'userProfile';
const entityCode = `
     @PrimaryGeneratedColumn({ name: 'MUsr_Id' })
    id!: number;

    @Column({ name: 'MUsr_Username', length: 100, unique: true })
    username!: string;

    @Column({ name: 'MUsr_FirstName', length: 100, nullable: true })
    firstName?: string;

    @Column({ name: 'MUsr_LastName', length: 100, nullable: true })
    lastName?: string;

    @Column({ name: 'MUsr_DateOfBirth', type: 'date', nullable: true })
    dateOfBirth?: Date;

    @Column({ name: 'MUsr_Gender', length: 20, nullable: true })
    gender?: string;

    @Column({ name: 'MUsr_PermanentAddress', length: 500, nullable: true })
    permanentAddress?: string;

    @Column({ name: 'MUsr_CurrentAddress', length: 500, nullable: true })
    currentAddress?: string;

    @Column({ name: 'MUsr_EmailId', length: 100, unique: true })
    email?: string;

    @Column({ name: 'MUsr_Mobile', length: 100, unique: true })
    mobile?: string;

    @Column({ name: 'MUsr_PAN', length: 20, nullable: true })
    pan?: string;

    @ManyToOne(() => DepartmentEntity, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'MUsr_Department', referencedColumnName: 'id' })
    department?: DepartmentEntity;

    @ManyToOne(() => OfficeEntity, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'MUsr_Office', referencedColumnName: 'id' })
    office?: OfficeEntity;

    @ManyToOne(() => DesignationEntity, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'MUsr_Designation', referencedColumnName: 'id' })
    designation?: DesignationEntity;

    @ManyToOne(() => EmploymentTypeEntity, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'MUsr_EmploymentType', referencedColumnName: 'id' })
    employmentType?: EmploymentTypeEntity;

    @Column({ name: 'MUsr_DateOfJoiningService', type: 'date', nullable: true })
    dateOfJoiningService?: Date;

    @Column({ name: 'MUsr_DateOfJoiningCurrentPost', type: 'date', nullable: true })
    dateOfJoiningCurrentPost?: Date;

    @ManyToOne(() => OfficerClassEntity, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'MUsr_OfficerClass', referencedColumnName: 'id' })
    officerClass?: OfficerClassEntity;

    @Column({ name: 'MUsr_Password', length: 60 })
    password!: string;

    @Column({ name: 'MUsr_LastLogin', type: 'timestamp', nullable: true })
    lastLogin?: Date;

    @Column({ name: 'MUsr_PasswordChangedAt', type: 'timestamp', nullable: true })
    passwordChangedAt?: Date;

    @Column({ name: 'MUsr_PasswordResetToken', length: 100, nullable: true })
    passwordResetToken?: string;

    @Column({ name: 'MUsr_PasswordResetExpires', type: 'timestamp', nullable: true })
    passwordResetExpires?: Date;
`;
const projectPath = 'D:/Angular/planning/planning-frontend';

generateFiles(entity, entityCode, projectPath);