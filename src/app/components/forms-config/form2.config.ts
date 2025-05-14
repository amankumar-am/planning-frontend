// src/app/components/forms-config/form2.config.ts

export const form2Config = {
    columns: [
        {
            fields: [
                { name: 'sanctionId', type: 'text', label: 'Sanction ID', required: true },
                { name: 'sanctionDate', type: 'date', label: 'Sanction Date', required: true },
            ],
        },
    ],
};