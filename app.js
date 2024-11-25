import express, { json } from 'express';
import followRoutes from './src/routes/followRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();
app.use(json());

// Attach follow routes
app.use('/api', followRoutes);
app.use('/api', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
