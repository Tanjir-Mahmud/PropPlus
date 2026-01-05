import { db } from '../config/firebase.js';

const leadsCollection = db.collection('leads');

export const leadRepository = {
    getAll: async () => {
        const snapshot = await leadsCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    create: async (lead) => {
        const docRef = await leadsCollection.add({
            ...lead,
            createdAt: new Date().toISOString()
        });
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    update: async (id, updateData) => {
        const docRef = leadsCollection.doc(id);
        await docRef.update(updateData);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    delete: async (id) => {
        await leadsCollection.doc(id).delete();
        return true;
    }
};
