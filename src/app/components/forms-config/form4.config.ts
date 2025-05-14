// src/app/components/forms-config/form4.config.ts

export const form4Config = {
    columns: [
        {
            fields: [
                { name: 'sanctionId', type: 'text', label: 'Sanction ID', required: true },
                { name: 'sanctionDate', type: 'date', label: 'Sanction Date', required: true },
            ],
        },
    ],
};