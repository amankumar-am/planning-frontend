// src/app/models/financial-year.model.ts
export interface FinancialYear {
    id: number;
    name: string;
    duration: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isCurrent: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateFinancialYearDto {
    id: number;
    name: string;
    duration: string;
    startDate: Date;
    endDate: Date;
    isActive?: boolean;
    isCurrent?: boolean;
}

export interface UpdateFinancialYearDto extends Partial<CreateFinancialYearDto> {
    modifiedBy: string;
    modifiedAt: Date;
}

export interface FinancialYearResponse {
    schema: any[]; // Define the schema structure
    data: FinancialYear[]; // Array of FinancialYear objects
}