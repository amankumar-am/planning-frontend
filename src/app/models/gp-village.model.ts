// src/app/models/gp-village.model.ts

import { District } from "./district.model";
import { Taluka } from "./taluka.model";


export interface GpVillage {
    id: number;
    lgdCode: string;
    nameEn: string;
    name: string;
    nameGu: string;
    villagesIncluded: string;
    population2011: string;
    district: District;
    taluka: Taluka;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateGpVillageDto {
    id: number;
    lgdCode: string;
    nameEn: string;
    name: string;
    nameGu: string;
    villagesIncluded: string;
    population2011: string;
    district: District;
    taluka: Taluka;
    isActive?: boolean;
}

export interface UpdateGpVillageDto extends Partial<CreateGpVillageDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
