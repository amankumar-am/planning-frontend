// src/app/models/subsector.model.ts


export interface Subsector {
    id: number;
    name: string;
    nameEn: string;
    nameGu: string;
    sector: number;
    subsectorNumber: number;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateSubsectorDto {
    id: number;
    name: string;
    nameEn: string;
    nameGu: string;
    sector: number;
    subsectorNumber: number;
    isActive?: boolean;
}

export interface UpdateSubsectorDto extends Partial<CreateSubsectorDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
