import { ReferenceSchema } from "./BaseReferenceUtilsService";
import { FinancialYear } from "./financialYear/financialYear.model";

export interface HasName {
    name: string;
}

export interface ReferenceDataResponse<T> {
    schema: ReferenceSchema<T>[];
    data: T[];
    defaultVisibleColumns: string[]
}