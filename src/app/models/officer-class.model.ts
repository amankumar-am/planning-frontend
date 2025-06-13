
export interface OfficerClass {
    id: number;
    code: string;
    name: string;
    nameEn: string;
    nameGu: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateOfficerClassDto {
    id: number;
    code: string;
    name: string;
    nameEn: string;
    nameGu: string;    isActive?: boolean;
}

export interface UpdateOfficerClassDto extends Partial<CreateOfficerClassDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
