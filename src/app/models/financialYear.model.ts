// src/app/models/financialYear.model.ts
export interface FinancialYear {
    id: number;
    name: string;
    duration: string;
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
    isActive: boolean;
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

