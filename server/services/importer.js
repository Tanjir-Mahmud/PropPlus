import * as XLSX from 'xlsx';

const SMART_MAPPINGS = {
    leads: {
        name: ['name', 'full name', 'client name', 'lead/property name', 'lead name', 'client'],
        phone: ['phone', 'mobile', 'contact', 'contact/location', 'number'],
        email: ['email', 'mail'],
        budget: ['budget', 'price', 'budget/price', 'amount', 'willing to pay'],
        status: ['status', 'stage', 'source/status'],
        source: ['source', 'channel', 'referrer', 'source/status'],
        type: ['type', 'category'], // Capture 'Lead', 'Apartment', etc.
        propertyId: ['property', 'interest'],
    },
    inventory: {
        title: ['title', 'name', 'property name', 'lead/property name', 'unit'],
        location: ['location', 'address', 'contact/location', 'city'],
        price: ['price', 'cost', 'budget/price', 'asking price'],
        type: ['type', 'category', 'property type'],
        status: ['status', 'availability', 'source/status'],
        sqft: ['sqft', 'square feet', 'size']
    }
};

const normalizeHeader = (header) => header.toLowerCase().trim().replace(/_/g, ' ');

const mapRow = (row, mappingType) => {
    const mapping = SMART_MAPPINGS[mappingType];
    const mappedData = {};
    const rowKeys = Object.keys(row);

    for (const [targetField, possibleHeaders] of Object.entries(mapping)) {
        // Find a matching key in the row
        const match = rowKeys.find(key => {
            const normalized = normalizeHeader(key);
            return possibleHeaders.some(h => normalized === h || normalized.includes(h));
        });

        if (match) {
            mappedData[targetField] = row[match];
        }
    }

    // validation/defaults
    if (mappingType === 'leads') {
        if (!mappedData.status) mappedData.status = 'New';
        if (!mappedData.source) mappedData.source = 'Imported';
    }

    return mappedData;
};

export const parseImportFile = (buffer, type = 'leads') => {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    return rawData.map(row => mapRow(row, type));
};
