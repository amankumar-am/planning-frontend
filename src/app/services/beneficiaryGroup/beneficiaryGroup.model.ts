// src/app/models/financial-year.model.ts
export interface BeneficiaryGroup {
    id: number;
    name: string;
    name_gu: string;
    description: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateBeneficiaryGroupDto {
    id: number;
    name: string;
    name_gu: string;
    description: string;
}

export interface UpdateBeneficiaryGroupDto extends Partial<CreateBeneficiaryGroupDto> {
    modifiedBy: string;
    modifiedAt: Date;
}

