import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 8000;

mongoose.connect('mongodb://mongodb:27017/ecommerce');

app.get('/', (req, res) => {
  res.send('Hello World! ggwp')
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});
