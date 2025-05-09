// src/app/services/generic.model.ts

import { ReferenceSchema } from "./BaseReferenceUtilsService";

export interface HasName {
    name: string;
}

export interface ReferenceDataResponse<T> {
    schema: ReferenceSchema<T>[];
    data: T[];
    defaultVisibleColumns: string[]
}