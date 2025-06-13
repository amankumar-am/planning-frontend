// src/app/services/utils/user-profile-utils.service.ts


import { Injectable } from '@angular/core';
import { UserProfile } from '../../models/user-profile.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { UserProfileService } from '../user-profile/user-profile.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class UserProfileUtilsService extends BaseReferenceUtilsService<UserProfile> {
    constructor(private userProfileService: UserProfileService) {
        super();
        this.labelField = 'UserProfile';
    }

    protected async fetchAllItems(): Promise<{ data: UserProfile[]; schema: ReferenceSchema<UserProfile>[], defaultVisibleColumns: string[] }> {
        console.log('UserProfileUtilsService.fetchAllItems called');
        const response = await firstValueFrom(this.userProfileService.getAllUserProfiles());
        console.log('UserProfile getAllUserProfiles response:', response);

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        console.log('UserProfile fetchAllItems processed result:', result);
        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: UserProfile[]; schema: ReferenceSchema<UserProfile>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.userProfileService.getUserProfilesWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };
        return result;
    }

    private createDefaultSchema(): ReferenceSchema<UserProfile>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'username', label: 'Username' },
            { field: 'firstName', label: 'First Name' },
            { field: 'lastName', label: 'Last Name' },
            { field: 'email', label: 'Email' },
            { field: 'mobile', label: 'Mobile' },
            { field: 'isActive', label: 'Active' },
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['firstName', 'lastName', 'username', 'email'];
    }
}
