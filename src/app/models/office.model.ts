
export interface Office {
    id: number;
    code: string;
    nicCode: string;
    nameEn: string;
    name: string;
    nameGu: string;
    officeLevel: any;
    department: any;
    reportsTo: any;
    email: string;
    landline: string;
    controlRoomPhNo: string;
    address: string;
    state: any;
    district: any;
    prant: any;
    taluka: any;
    village: any;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateOfficeDto {
    id: number;
    code: string;
    nicCode: string;
    nameEn: string;
    name: string;
    nameGu: string;
    officeLevel: any;
    department: any;
    reportsTo: any;
    email: string;
    landline: string;
    controlRoomPhNo: string;
    address: string;
    state: any;
    district: any;
    prant: any;
    taluka: any;
    village: any;    isActive?: boolean;
}

export interface UpdateOfficeDto extends Partial<CreateOfficeDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
