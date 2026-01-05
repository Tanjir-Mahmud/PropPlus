import express from 'express';
import multer from 'multer';
import { leadRepository } from '../repositories/leadRepository.js';
import { inventoryRepository } from '../repositories/inventoryRepository.js';
import { dealRepository } from '../repositories/dealRepository.js';
import { parseImportFile } from '../services/importer.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper: Calculate Commission
const GLOBAL_COMMISSION_RATE = 2.5;

// --- Import Route ---
// --- Import Route ---
router.post('/import/parse', upload.single('file'), async (req, res) => {
    try {
        const type = req.body.type || 'leads';
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const parsedData = parseImportFile(req.file.buffer, type);
        res.json({ data: parsedData, count: parsedData.length });
    } catch (error) {
        console.error("Parse Error:", error);
        res.status(500).json({ error: 'Failed to parse file' });
    }
});

router.post('/import', upload.single('file'), async (req, res) => {
    try {
        const type = req.body.type || 'leads';
        const userId = req.body.userId; // Extract userId
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const parsedData = parseImportFile(req.file.buffer, type);
        const count = await processImportData(parsedData, type, userId);

        res.json({ message: `Successfully imported ${count} items`, count });
    } catch (error) {
        console.error("Import Error:", error);
        res.status(500).json({ error: 'Failed to process import file' });
    }
});

router.post('/import/url', async (req, res) => {
    try {
        const { url, type = 'leads', userId } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const fetchResponse = await fetch(url);
        if (!fetchResponse.ok) throw new Error("Failed to fetch from URL");

        const arrayBuffer = await fetchResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const parsedData = parseImportFile(buffer, type);
        const count = await processImportData(parsedData, type, userId);

        res.json({ message: `Successfully synced ${count} items from Sheet`, count });
    } catch (error) {
        console.error("URL Import Error:", error);
        res.status(500).json({ error: 'Failed to sync from URL. Ensure the link is a valid CSV export.' });
    }
});

async function processImportData(data, defaultType = 'leads', userId = null) {
    let createdCount = 0;
    const VALID_STAGES = ['New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed', 'Lost'];

    for (const item of data) {
        // Detect Type dynamically if present
        let itemType = defaultType;
        if (item.type) {
            const lowerType = item.type.toLowerCase();
            if (lowerType.includes('lead')) itemType = 'leads';
            else if (['apartment', 'land', 'commercial', 'house', 'villa'].some(t => lowerType.includes(t))) itemType = 'inventory';
        }

        if (itemType === 'leads') {
            // It's a Lead
            const leadName = item.name || item.title;
            if (leadName) {
                // Formatting Check
                let finalStatus = item.status || 'New';
                let finalSource = item.source || 'Google Sheets';

                // Disambiguate Source/Status if they came from the same hybrid column
                // Case 1: Value is a Source (e.g. "FB Ads") -> Status should be New, Source should be FB Ads
                if (!VALID_STAGES.includes(finalStatus)) {
                    finalStatus = 'New';
                    // item.source is already "FB Ads" via mapping, so we leave it 
                }
                // Case 2: Value is a Status (e.g. "Contacted") -> Status is Contacted, Source should NOT be "Contacted"
                else if (VALID_STAGES.includes(finalSource)) {
                    finalSource = 'Google Sheets'; // Default back since the column contained a Status
                }

                const leadData = {
                    name: leadName,
                    phone: item.phone || item.location,
                    budget: item.budget || item.price,
                    status: finalStatus,
                    source: finalSource,
                    type: 'Lead'
                };
                await leadRepository.create(leadData, userId);
                createdCount++;
            }
        } else {
            // It's Inventory
            const invTitle = item.title || item.name;
            if (invTitle) {
                const invData = {
                    title: invTitle,
                    location: item.location || item.phone,
                    price: item.price || item.budget,
                    type: item.type || 'Property',
                    status: item.status || 'Available'
                };
                await inventoryRepository.create(invData, userId);
                createdCount++;
            }
        }
    }
    return createdCount;
}

// --- Leads Routes ---
router.get('/leads', async (req, res) => {
    try {
        const leads = await leadRepository.getAll();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/leads', async (req, res) => {
    try {
        const lead = await leadRepository.create(req.body);
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/leads/:id', async (req, res) => {
    try {
        const updated = await leadRepository.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Lead not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Inventory Routes ---
router.get('/inventory', async (req, res) => {
    try {
        const items = await inventoryRepository.getAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/inventory', async (req, res) => {
    try {
        const item = await inventoryRepository.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/inventory/:id', async (req, res) => {
    try {
        const updated = await inventoryRepository.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Item not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Deals Routes ---
router.get('/deals', async (req, res) => {
    try {
        const deals = await dealRepository.getAll();
        res.json(deals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/deals', async (req, res) => {
    try {
        const { propertyId } = req.body;
        const inventory = await inventoryRepository.getAll();
        const property = inventory.find(p => p.id == propertyId);

        if (!property) return res.status(404).json({ error: 'Property not found' });

        const commissionAmount = property.price * (GLOBAL_COMMISSION_RATE / 100);

        const deal = await dealRepository.create({
            ...req.body,
            commissionAmount,
            status: 'Pending'
        });

        await inventoryRepository.update(propertyId, { status: 'Sold' });

        res.status(201).json(deal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/deals/:id/approve', async (req, res) => {
    try {
        const deal = await dealRepository.updateStatus(req.params.id, 'Approved');
        if (!deal) return res.status(404).json({ error: 'Deal not found' });
        res.json(deal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
