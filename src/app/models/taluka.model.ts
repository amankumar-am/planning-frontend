// src/app/models/taluka.model.ts

import { District } from "./district.model";


export interface Taluka {
    id: number;
    eDharaCode: number;
    nameEn: string;
    name: string;
    nameGu: string;
    district: District;
    prant: number;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateTalukaDto {
    id: number;
    eDharaCode: number;
    nameEn: string;
    nameGu: string;
    district: number;
    prant: number; isActive?: boolean;
}

export interface UpdateTalukaDto extends Partial<CreateTalukaDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
