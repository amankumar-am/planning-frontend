// src/app/components/forms-config/form1.config.ts

export const form1Config = {
    columns: [
        {
            fields: [
                { name: 'demand_number', type: 'text', label: 'Number', readonly: true, defaultValue: '1' },
                { name: 'demand_workId', type: 'text', label: 'Work ID', required: true },
                { name: 'demand_financialYear', type: 'reference', label: 'Financial Year', required: true, options: 'financialYears', displayField: 'name', valueField: 'id' },
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
                { name: 'demand_fund', type: 'reference', label: 'Fund', required: true, options: 'funds', displayField: 'fundingSource_En', valueField: 'id' },
                { name: 'demand_MpMlaName', type: 'reference', label: 'MP/MLA Name', required: true, options: 'mpmlas', displayField: 'name', valueField: 'id' },
                { name: 'demand_estimatedCompletionDate', type: 'date', label: 'Estimation Completion Date', required: true },
                { name: 'demand_workDescription', type: 'textarea', label: 'Work Description', required: true, minLength: 10 },
                { name: 'demand_importanceOfWork', type: 'text', label: 'Importance of Work', required: true },
            ],
        },
        {
            fields: [
                { name: 'demand_sector', type: 'reference', label: 'Sector', required: true, options: 'sectors', displayField: 'nameGu', valueField: 'id' },
                { name: 'demand_subSector', type: 'reference', label: 'Sub-Sector', required: true, options: 'subSectors', dependsOn: 'demand_sector', displayField: 'nameGu', valueField: 'id' },
                { name: 'demand_beneficiaryDistrict', type: 'reference', label: 'Beneficiary District', required: true, options: 'districts', displayField: 'nameGu', valueField: 'id', defaultValue: { nameEn: 'Mehsana' } },
                { name: 'demand_beneficiaryTaluka', type: 'reference', label: 'Beneficiary Taluka', required: true, options: 'talukas', dependsOn: 'demand_beneficiaryDistrict', displayField: 'nameGu', valueField: 'id' },
                { name: 'demand_beneficiaryGroup', type: 'reference', label: 'Beneficiary Group', required: false, options: 'beneficiaryGroups', displayField: 'name_gu', valueField: 'id' },
                { name: 'demand_beneficiaryAreaType', type: 'radio', label: 'Beneficiary Area Type', required: true, options: ['urban', 'village'] },
                { name: 'demand_beneficiaryVillage', type: 'reference', label: 'Beneficiary Village', conditional: 'demand_beneficiaryAreaType:village', options: 'villages', dependsOn: 'demand_beneficiaryTaluka', displayField: 'nameGu', valueField: 'id' },
                { name: 'demand_beneficiaryNagarpalika', type: 'text', label: 'Beneficiary Nagarpalika', conditional: 'demand_beneficiaryAreaType:urban' },
            ],
        },
        {
            fields: [
                { name: 'demand_officer', type: 'reference', label: 'Demand Officer', required: true, options: 'userProfiles', displayField: ['firstName', 'lastName'], displayFieldSeparator: ' ', valueField: 'id', filters: { isActive: true }, sortBy: 'firstName', sortOrder: 'asc' },
                { name: 'demand_assignPSTo', type: 'reference', label: 'Assign PS To', required: true, options: 'userProfiles', displayField: ['firstName', 'lastName'], displayFieldSeparator: ' - ', valueField: 'id', filters: { isActive: true }, sortBy: 'firstName', sortOrder: 'asc' },
                { name: 'demand_implementationOfficer', type: 'reference', label: 'Implementation Officer', required: true, options: 'userProfiles', displayField: ['firstName', 'lastName'], displayFieldSeparator: ' - ', valueField: 'id', filters: { isActive: true }, sortBy: 'username', sortOrder: 'asc' },
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