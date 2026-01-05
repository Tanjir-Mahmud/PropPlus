import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../../db.json'); // Store db.json in root of server or one level up? Let's keep it in server root.
// Actually, let's keep it simple: 'db.json'
const adapter = new JSONFile('db.json');
const defaultData = { leads: [], inventory: [], deals: [] };
const db = new Low(adapter, defaultData);

await db.read();
db.data ||= defaultData;
await db.write();

export { db };
