// src/app/models/fund.model.ts


export interface Fund {
    id: number;
    name: string
    fundingGroup: string;
    fundingSource_En: string;
    fundingSource_Gu: string;
    financialYear: string;
    grantValue: number;
    act: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateFundDto {
    id: number;
    fundingGroup: string;
    fundingSource_En: string;
    fundingSource_Gu: string;
    financialYear: string;
    grantValue: number;
    act: string; isActive?: boolean;
    isCurrent?: boolean;
}

export interface UpdateFundDto extends Partial<CreateFundDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
