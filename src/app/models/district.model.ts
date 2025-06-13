// src/app/models/district.model.ts

import { State } from "./state.model";


export interface District {
    id: number;
    eDharaCode: number;
    nameEn: string;
    nameGu: string;
    name: string
    state: State;
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
