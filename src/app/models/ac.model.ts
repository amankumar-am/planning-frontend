
export interface Ac {
    id: number;
    code: number;
    nameEn: string;
    nameGu: string;
    district: any;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateAcDto {
    id: number;
    code: number;
    nameEn: string;
    nameGu: string;
    district: any;    isActive?: boolean;
}

export interface UpdateAcDto extends Partial<CreateAcDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
