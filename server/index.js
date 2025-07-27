import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { generateQuestions } from './endpoints.js';
dotenv.config({ debug: true });

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.post('/generate-questions', generateQuestions);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
