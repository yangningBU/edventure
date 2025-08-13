import LLMInteractor from './llm-interactor.js';

export const generateQuestions = async (req, res) => {
  const { prompt, lang } = req.body;

  if (!prompt) {
    console.error('Missing prompt.');
    return res
      .status(400)
      .json({ error: 'Prompt is required' });
  }

  try {
    const interactor = new LLMInteractor(lang);
    const formattedResponse = await interactor.submitPrompt(prompt);
    res.json({ questionsByLevel: formattedResponse });
  } catch (err) {
    console.error("Generating questions failed.", err);
    res.status(500).json({ error: err.message });
  }
}