import { db } from '../config/firebase.js';

const dealsCollection = db.collection('deals');

export const dealRepository = {
    getAll: async () => {
        const snapshot = await dealsCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    create: async (deal) => {
        const docRef = await dealsCollection.add({
            ...deal,
            status: deal.status || 'Pending',
            commissionAmount: Number(deal.commissionAmount) || 0
        });
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    },
    updateStatus: async (id, status) => {
        const docRef = dealsCollection.doc(id);
        await docRef.update({ status });
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    }
};
