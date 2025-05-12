// src/app/models/district.model.ts


export interface District {
    id: number;
    eDharaCode: number;
    nameEn: string;
    nameGu: string;
    name: string
    state: number;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateDistrictDto {
    id: number;
    eDharaCode: number;
    nameEn: string;
    nameGu: string;
    state: number; isActive?: boolean;
}

export interface UpdateDistrictDto extends Partial<CreateDistrictDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
