
export interface Department {
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

export interface CreateDepartmentDto {
    id: number;
    code: string;
    name: string;
    nameEn: string;
    nameGu: string;    isActive?: boolean;
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
