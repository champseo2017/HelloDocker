import express from 'express';
import connectDB from '@config/db';
import router from './routes';
import { getHome } from '@controllers/home';

const app = express();
const port = 8000;

// Connect to MongoDB
connectDB();

// Use router
app.use('/', getHome);
app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
