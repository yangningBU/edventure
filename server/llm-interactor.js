import { OpenAI } from 'openai';
import { DEFAULT_LANG, LANG_CODES } from './constants.js';

const ExerciseSchema = {
  type: "object",
  properties: {
    question: { type: "string" },
    choices: { type : "array", items: { type: "string" }},
    correctAnswerIndex: { type: "number" }
  },
  required: ["question", "choices", "correctAnswerIndex"]
}

const ResponseSchema = {
  name: "exercise_questions",
  schema: {
    type: "object",
    properties: {
      beginner: { type: "array", items: ExerciseSchema },
      intermediate: { type: "array", items: ExerciseSchema },
      expert: { type: "array", items: ExerciseSchema },
    },
    required: ["beginner", "intermediate", "expert"]
  }
} 

class LLMInteractor {
  constructor(lang = DEFAULT_LANG) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.language = LANG_CODES[lang];
    this.resetResults();
  }

  resetResults() {
    this.completion = null;
    this.cost = null;
    this.formattedResponse = null;
    this.rawResponse = null;
    this.prompt = null;
  }

  async submitPrompt(prompt) {
    this.resetResults();
    this.prompt = prompt;

    const startTime = new Date();
    console.log(`Generating questions for prompt: "${this.prompt}" in ${this.language} at ${startTime.toISOString()}.`);

    this.completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates multiple choice questions with 4 answer choices for different levels of difficulty.'
        },
        {
          role: 'user',
          content: `Generate a JSON object that contains 3 sets of exercise questions based on a prompt. ` +
              'The questions in each set should be of increasing difficulty, starting at "beginner", then "intermediate", and ending with "expert". ' +
              'Each set should contain 10 questions at the corresponding difficulty level. ' + 
              `The prompt is: "${this.prompt}". Return results in ${this.language}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: {
        type: "json_schema",
        json_schema: ResponseSchema
      }
    });

    this.processResponse();

    const endTime = new Date();
    const duration = endTime - startTime;
    console.log(`Request completed at ${endTime.toISOString()}.`)
    console.log(`It took ${duration}ms (${(duration / 1000).toFixed(2)}s).`);
    console.log(`It cost ${this.getCost() ?? 'unknown'} tokens.`);

    return this.formattedResponse;
  }

  processResponse() {
    this.cost = this.completion?.usage?.total_tokens;
    this.rawResponse = this.completion.choices[0].message.content;
  
    try {
      this.formattedResponse = JSON.parse(this.rawResponse);
      console.log('Exercise questions generated successfully.')
    } catch (e) {
      console.error(e);
      console.log(`Response from interactor: ${this.rawResponse}`);
      throw new Error(
        'Failed to parse JSON from OpenAI response. ' +
        'Either the response syntax contains erroneous characters ' +
        'or the token limit is too low.'
      );
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