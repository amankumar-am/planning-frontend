
export interface Designation {
    id: number;
    code: string;
    department: any;
    nameEn: string;
    name: string;
    nameGu: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateDesignationDto {
    id: number;
    code: string;
    department: any;
    nameEn: string;
    name: string;
    nameGu: string;    isActive?: boolean;
}

export interface UpdateDesignationDto extends Partial<CreateDesignationDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
