import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config({ debug: true });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate-questions', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    console.error('Missing prompt.');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log(`Generating questions for prompt: "${prompt}".`);
    
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates multiple choice questions with 4 answer choices.' },
        {
          role: 'user',
          content: `Generate a JSON object that contains 3 sets of exercise questions based on a prompt. ` +
              'The questions in each set should be of increasing difficulty, starting at "beginner", then "intermediate", and ending with "expert". ' +
              'Each set should contain 10 questions at the corresponding difficulty level. ' + 
              'Each question should contain: a) the question text, b) four answer choices, one of which must be the correct answer to the question, ' +
              'and c) the correctAnswerIndex as a number (between 0-3 to indicate the index of the corresponding answer choice). ' +
              'The response should be keyed by the level of difficulty and contain an array of JSON objects with the keys: question, choices, and correctAnswerIndex. ' +
              `The prompt is: "${prompt}". ` +
              'The response should be a valid JSON object. Here is a sample partial response: ' +
              '{"beginner": [{"question": "What is the capital of France?", "choices": ["Paris", "London", "Berlin", "Madrid"], ' +
              '"correctAnswerIndex": 0}], "intermediate": ...}'
        }
      ],
      temperature: 0.7,
      max_tokens: 2400,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`OpenAI completion took ${duration}ms (${(duration / 1000).toFixed(2)}s)`);

    let questionsByLevel;
    try {
      questionsByLevel = JSON.parse(completion.choices[0].message.content);
      console.log('Exercises generated successfully.')
    } catch (e) {
      throw new Error('Failed to parse questions from OpenAI response. Try increasing the token limit.');
    }

    res.json({ questionsByLevel });
  } catch (err) {
    console.error("Generating questions failed.", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
