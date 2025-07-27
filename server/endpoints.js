import LLMInteractor from './llm-interactor.js';

export const generateQuestions = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    console.error('Missing prompt.');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const startTime = new Date();
    const interactor = new LLMInteractor();
    console.log(`Generating questions for prompt: "${prompt}" at ${startTime.toISOString()}.`);

    await interactor.submitPrompt(prompt);

    const endTime = new Date();
    const duration = endTime - startTime;
    console.log(`Request completed at ${endTime.toISOString()}.`)
    console.log(`It took ${duration}ms (${(duration / 1000).toFixed(2)}s).`);
    console.log(`It cost ${interactor.getCost() ?? 'unknown'} tokens.`);

    const questionsByLevel = interactor.getFormattedResponse();
    console.log('Exercise questions generated successfully.')
    res.json({ questionsByLevel });
  } catch (err) {
    console.error("Generating questions failed.", err);
    res.status(500).json({ error: err.message });
  }
}