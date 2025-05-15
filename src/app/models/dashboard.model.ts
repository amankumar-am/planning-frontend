// src/app/models/dashboard.model.ts

export interface ApiUniqueCountResponse {
    uniqueCount: number;
    title: string;
}


export interface ApiChartDataPoint {
    label: string | number; // The value of the grouped column (e.g., fund name, stage number)
    value: number;         // The count
}

export interface ApiChartDataResponse {
    data: ApiChartDataPoint[];
    title: string;
    xAxisTitle: string;
    // chartType?: string; // API might not send this; Angular can decide
}