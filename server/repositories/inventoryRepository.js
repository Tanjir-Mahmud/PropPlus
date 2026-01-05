import { db } from '../config/firebase.js';

const inventoryCollection = db.collection('inventory');

export const inventoryRepository = {
    getAll: async () => {
        const snapshot = await inventoryCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    create: async (item) => {
        const docRef = await inventoryCollection.add({
            ...item,
            status: item.status || 'Available'
        });
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    update: async (id, updateData) => {
        const docRef = inventoryCollection.doc(id);
        await docRef.update(updateData);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    delete: async (id) => {
        await inventoryCollection.doc(id).delete();
        return true;
    }
};
