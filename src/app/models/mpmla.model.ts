
export interface Mpmla {
    id: number;
    name: string;
    designation: string;
    startDate: Date;
    endDate: Date;
    legislativeConstituency: any;
    parliamentaryConstituency: any;
    politicalParty: string;
    term: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateMpmlaDto {
    id: number;
    name: string;
    designation: string;
    startDate: Date;
    endDate: Date;
    legislativeConstituency: any;
    parliamentaryConstituency: any;
    politicalParty: string;
    term: string;    isActive?: boolean;
}

export interface UpdateMpmlaDto extends Partial<CreateMpmlaDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
