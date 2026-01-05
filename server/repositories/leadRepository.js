import { db } from '../config/firebase.js';

export const leadRepository = {
    getAll: async (userId) => {
        const collection = userId ? db.collection('users').doc(userId).collection('leads') : db.collection('leads');
        const snapshot = await collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    create: async (lead, userId) => {
        const collection = userId
            ? db.collection('users').doc(userId).collection('leads')
            : db.collection('leads');

        const docRef = await collection.add({
            ...lead,
            createdAt: new Date().toISOString()
        });
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    update: async (id, updateData, userId) => {
        const collection = userId ? db.collection('users').doc(userId).collection('leads') : db.collection('leads');
        const docRef = collection.doc(id);
        await docRef.update(updateData);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    delete: async (id, userId) => {
        const collection = userId ? db.collection('users').doc(userId).collection('leads') : db.collection('leads');
        await collection.doc(id).delete();
        return true;
    }
};
