import { db } from '../config/firebase.js';

export const inventoryRepository = {
    getAll: async (userId) => {
        const collection = userId ? db.collection('users').doc(userId).collection('inventory') : db.collection('inventory');
        const snapshot = await collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    create: async (item, userId) => {
        const collection = userId
            ? db.collection('users').doc(userId).collection('inventory')
            : db.collection('inventory');

        const docRef = await collection.add({
            ...item,
            status: item.status || 'Available'
        });
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    update: async (id, updateData, userId) => {
        const collection = userId ? db.collection('users').doc(userId).collection('inventory') : db.collection('inventory');
        const docRef = collection.doc(id);
        await docRef.update(updateData);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    delete: async (id, userId) => {
        const collection = userId ? db.collection('users').doc(userId).collection('inventory') : db.collection('inventory');
        await collection.doc(id).delete();
        return true;
    }
};
