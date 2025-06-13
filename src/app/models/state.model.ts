
export interface State {
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

export interface CreateStateDto {
    id: number;
    code: number;
    nameEn: string;
    nameGu: string;
    district: any;    isActive?: boolean;
}

export interface UpdateStateDto extends Partial<CreateStateDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
