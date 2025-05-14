// src/app/components/forms-config/form3.config.ts

export const form3Config = {
    columns: [
        {
            fields: [
                { name: 'sanctionId', type: 'text', label: 'Sanction ID', required: true },
                { name: 'sanctionDate', type: 'date', label: 'Sanction Date', required: true },
            ],
        },
    ],
};