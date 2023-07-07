import express from 'express';
import connectDB from './config/db';
import router from './routes';

const app = express();
const port = 8000;

// Connect to MongoDB
connectDB();

// Use router
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
