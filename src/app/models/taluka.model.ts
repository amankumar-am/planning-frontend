// src/app/models/taluka.model.ts

import { District } from "./district.model";
import { Prant } from "./prant.model";


export interface Taluka {
    id: number;
    eDharaCode: number;
    nameEn: string;
    name: string;
    nameGu: string;
    district: District;
    prant: Prant;
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
    district: District;
    prant: Prant;
    isActive?: boolean;
}

export interface UpdateTalukaDto extends Partial<CreateTalukaDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
