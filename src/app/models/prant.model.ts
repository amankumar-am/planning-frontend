
export interface Prant {
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

export interface CreatePrantDto {
    id: number;
    code: string;
    name: string;
    nameEn: string;
    nameGu: string;    isActive?: boolean;
}

export interface UpdatePrantDto extends Partial<CreatePrantDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
