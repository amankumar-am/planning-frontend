// src/app/services/utils/user-profile-utils.service.ts


import { Injectable } from '@angular/core';
import { UserProfile } from '../../models/user-profile.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { UserProfileService } from '../user-profile/user-profile.service';

@Injectable({
    providedIn: 'root'
})
export class UserProfileUtilsService extends BaseReferenceUtilsService<UserProfile> {
    constructor(private userProfileService: UserProfileService) {
        super();
        this.labelField = 'UserProfile';
    }

    protected async fetchAllItems(): Promise<{ data: UserProfile[]; schema: ReferenceSchema<UserProfile>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.userProfileService.getAllUserProfiles());

        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
