import express from 'express';
import bodyParser from 'body-parser';
import handler from './api/chat.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/chat', handler);

app.get('/', (req, res) => {
  res.send('Troverstar AI Assistant is running.');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});