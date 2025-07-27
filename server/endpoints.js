import LLMInteractor from './llm-interactor.js';

export const generateQuestions = async (req, res) => {
  const { prompt, lang } = req.body;

  if (!prompt) {
    console.error('Missing prompt.');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const interactor = new LLMInteractor(lang);
    await interactor.submitPrompt(prompt);
    const questionsByLevel = interactor.getFormattedResponse();
    res.json({ questionsByLevel });
  } catch (err) {
    console.error("Generating questions failed.", err);
    res.status(500).json({ error: err.message });
  }
}