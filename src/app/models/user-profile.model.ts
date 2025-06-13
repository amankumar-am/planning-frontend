
export interface UserProfile {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    permanentAddress: string;
    currentAddress: string;
    email: string;
    mobile: string;
    pan: string;
    department: any;
    office: any;
    designation: any;
    employmentType: any;
    dateOfJoiningService: Date;
    dateOfJoiningCurrentPost: Date;
    officerClass: any;
    password: string;
    lastLogin: Date;
    passwordChangedAt: Date;
    passwordResetToken: string;
    passwordResetExpires: Date;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date | null;
}

export interface CreateUserProfileDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    permanentAddress: string;
    currentAddress: string;
    email: string;
    mobile: string;
    pan: string;
    department: any;
    office: any;
    designation: any;
    employmentType: any;
    dateOfJoiningService: Date;
    dateOfJoiningCurrentPost: Date;
    officerClass: any;
    password: string;
    lastLogin: Date;
    passwordChangedAt: Date;
    passwordResetToken: string;
    passwordResetExpires: Date;    isActive?: boolean;
}

export interface UpdateUserProfileDto extends Partial<CreateUserProfileDto> {
    modifiedBy: string;
    modifiedAt: Date;
}
