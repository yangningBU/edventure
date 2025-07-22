import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate-questions', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates multiple choice questions with 4 answer choices.' },
        {
            role: 'user',
            content: 'Generate 10 exercise questions based on the following prompt. ' +
                'Each question should have: a) the question, b) four answer choices one of which must be the correct answer to the question, and c) the correct answer index as a number (0-3). ' +
                'The result of correct answer must correspond to the correct answer to the question. ' +
                'Return as a JSON array with keys: question, choices, correctAnswerIndex. ' +
                `Prompt: ${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });
    console.log('--------------------------------');
    console.log("completion", completion);
    console.log(completion.choices[0].message.content);
    console.log('--------------------------------');

    let questions;
    try {
      questions = JSON.parse(completion.choices[0].message.content);
      console.log("questions", questions);
    } catch (e) {
      const match = completion.choices[0].message.content.match(/\[.*\]/s);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse questions from OpenAI response');
      }
    }
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
