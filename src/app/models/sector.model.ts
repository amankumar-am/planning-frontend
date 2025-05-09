// src/app/models/sector.model.ts


export interface Sector {
    id: number;
    name: string;
    scheme: string;
    sectorNumber: number;
    nameEn: string;
    nameGu: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateSectorDto {
    id: number;
    scheme: string;
    sectorNumber: number;
    nameEn: string;
    nameGu: string; isActive?: boolean;
}

export interface UpdateSectorDto extends Partial<CreateSectorDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
