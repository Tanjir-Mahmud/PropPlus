import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
const PORT = 3000;

import apiRoutes from './routes/api.js';

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Prop-Pulse Backend Active' });
});

// Export the app for Vercel
export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
