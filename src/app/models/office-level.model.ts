
export interface OfficeLevel {
    id: number;
    code: string;
    nameEn: string;
    nameGu: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateOfficeLevelDto {
    id: number;
    code: string;
    nameEn: string;
    nameGu: string;    isActive?: boolean;
}

export interface UpdateOfficeLevelDto extends Partial<CreateOfficeLevelDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
