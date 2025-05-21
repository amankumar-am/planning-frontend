// src/app/components/forms-config/form1.config.ts

export const form1Config = {
    columns: [
        {
            fields: [
                { name: 'demand_number', type: 'text', label: 'Number', readonly: true, defaultValue: '1' },
                { name: 'demand_workId', type: 'text', label: 'Work ID', required: true },
                { name: 'demand_financialYear', type: 'reference', label: 'Financial Year', required: true, options: 'financialYears' },
                { name: 'demand_requestDate', type: 'date', label: 'Request Date', required: true },
                { name: 'demand_proposalAmount', type: 'number', label: 'Proposal Amount', required: true, pattern: /^\d+(\.\d{1,2})?$/ },
                { name: 'demand_proposalDate', type: 'date', label: 'Proposal Date', required: true },
                { name: 'demand_dmndNumber', type: 'text', label: 'Demand Number', required: true },
            ],
        },
        {
            fields: [
                { name: 'demand_proposerName', type: 'text', label: 'Proposer Name', required: true },
                { name: 'demand_schemeName', type: 'text', label: 'Scheme Name', required: true },
                { name: 'demand_fund', type: 'reference', label: 'Fund', required: true, options: 'funds' },
                { name: 'demand_MpMlaName', type: 'text', label: 'MP/MLA Name', required: true },
                { name: 'demand_estimatedCompletionDate', type: 'date', label: 'Estimation Completion Date', required: true },
                { name: 'demand_workDescription', type: 'textarea', label: 'Work Description', required: true, minLength: 10 },
                { name: 'demand_importanceOfWork', type: 'text', label: 'Importance of Work', required: true },
            ],
        },
        {
            fields: [
                { name: 'demand_sector', type: 'reference', label: 'Sector', required: true, options: 'sectors' },
                { name: 'demand_subSector', type: 'reference', label: 'Sub-Sector', required: true, options: 'subSectors' },
                { name: 'demand_beneficiaryDistrict', type: 'reference', label: 'Beneficiary District', required: true, options: 'districts' },
                { name: 'demand_beneficiaryTaluka', type: 'reference', label: 'Beneficiary Taluka', required: true, options: 'talukas' },
                { name: 'demand_beneficiaryAreaType', type: 'radio', label: 'Beneficiary Area Type', required: true, options: ['urban', 'village'] },
                { name: 'demand_beneficiaryVillage', type: 'reference', label: 'Beneficiary Village', conditional: 'demand_beneficiaryAreaType:village', options: 'villages' },
                { name: 'demand_beneficiaryNagarpalika', type: 'text', label: 'Beneficiary Nagarpalika', conditional: 'demand_beneficiaryAreaType:urban' },
                { name: 'demand_beneficiaryGroup', type: 'reference', label: 'Beneficiary Group', required: true, options: 'beneficiaryGroups' },
            ],
        },
        {
            fields: [
                { name: 'demand_officer', type: 'text', label: 'Demand Officer' },
                { name: 'demand_assignPSTo', type: 'text', label: 'Assign PS To', required: true },
                { name: 'demand_implementationOfficer', type: 'text', label: 'Implementation Officer', required: true },
                { name: 'demand_isTrust', type: 'checkbox', label: 'Trust?', defaultValue: false },
                { name: 'demand_trustName', type: 'text', label: 'Trust Name', conditional: 'demand_isTrust:true' },
                { name: 'demand_trustAddress', type: 'text', label: 'Trust Address', conditional: 'demand_isTrust:true' },
                { name: 'demand_trustRegistrationNumber', type: 'text', label: 'Trust Registration Number', conditional: 'demand_isTrust:true' },
                { name: 'demand_trustRegistrationDate', type: 'date', label: 'Trust Registration Date', conditional: 'demand_isTrust:true' },
                { name: 'demand_demandStatus', type: 'radio', label: 'Demand Status', required: true, options: ['draft', 'submit'] },
            ],
        },
    ],
};