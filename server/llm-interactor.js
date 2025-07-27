import { OpenAI } from 'openai';

class LLMInteractor {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.prompt = null;
    this.completion = null;
    this.rawResponse = null;
    this.extractedText = null;
    this.formattedResponse = null;
  }

  async submitPrompt(prompt) {
    this.prompt = prompt;
    this.completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
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
      max_tokens: 2500,
    });
    this.processResponse();
  }

  processResponse() {
    this.cost = this.completion?.usage?.total_tokens;
    this.rawResponse = this.completion.choices[0].message.content;
    this.extractedText = this.rawResponse.replace(/```json\n/, '').replace(/\n```/, '');
    
    try {
      this.formattedResponse = JSON.parse(this.extractedText);
    } catch (e) {
      console.error(errorMessage, e);
      console.log(`Response from interactor: ${this.rawResponse}`);
      throw new Error('Failed to parse JSON from OpenAI response. Either the response syntax contains erroneous characters or the token limit is too low.');
    }
  }

  getCost() {
    return this.cost;
  }

  getFormattedResponse() { 
    return this.formattedResponse;
  }
}

export default LLMInteractor;