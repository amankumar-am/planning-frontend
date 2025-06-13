
export interface EmploymentType {
    id: number;
    name: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateEmploymentTypeDto {
    id: number;
    name: string;    isActive?: boolean;
}

export interface UpdateEmploymentTypeDto extends Partial<CreateEmploymentTypeDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
