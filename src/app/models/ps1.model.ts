// src/app/models/ps1.model.ts


export interface Ps1 {
    id: number;
    name: number;
    financialYear: any;
    fund: any;
    taluka: any;
    sector: any;
    stage: number;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreatePs1Dto {
    id: number;
    financialYear: any;
    fund: any;
    taluka: any;
    sector: any;
    stage: number; isActive?: boolean;
}

export interface UpdatePs1Dto extends Partial<CreatePs1Dto> {
    modifiedBy: string;
    modifiedAt: Date;
}
