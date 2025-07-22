import React, { useState } from 'react';

const API_URL = `${import.meta.env.VITE_API_HOST || 'http://localhost:3002'}/generate-questions`;

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCorrectAnswerIndex = (qIdx) => {
    return questions[qIdx].correctAnswerIndex;
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setScore(null);
    setQuestions([]);
    setAnswers([]);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.questions) {
        setAnswers(Array(data.questions.length).fill(null));
        setQuestions(data.questions);
      } else {
        setError('Failed to generate questions.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  };

  const handleAnswer = (qIdx, aIdx) => {
    const correctAnswerIndex = getCorrectAnswerIndex(qIdx);
    const isCorrect = aIdx === correctAnswerIndex;
    console.log(`Question Index ${qIdx} answer ${aIdx} is ${isCorrect ? 'correct' : 'incorrect'}`);
    setAnswers((prev) => prev.map((ans, i) => (i === qIdx ? aIdx : ans)));
  };

  const handleSubmitAnswers = (e) => {
    e.preventDefault();
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== null && answers[i] === q.correctAnswerIndex) correct++;
    });
    setScore(correct);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6 mt-4">AI Exercise Generator</h1>
      <form onSubmit={handlePromptSubmit} className="w-full max-w-xl flex flex-col gap-4 mb-8">
        <input
          className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Enter a topic or prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {questions.length > 0 && (
        <form onSubmit={handleSubmitAnswers} className="w-full max-w-2xl p-6 rounded shadow">
          {questions.map((q, i) => (
            <div key={i} className="mb-6">
              <div className="font-semibold mb-2">{i + 1}. {q.question}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.choices.map((choice, j) => (
                  <label key={j} className={`flex items-center p-2 rounded border cursor-pointer ${answers[i] === j ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={j}
                      checked={answers[i] === j}
                      onChange={() => handleAnswer(i, j)}
                      className="mr-2"
                    />
                    <span>{String.fromCharCode(65 + j)}. {choice}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition disabled:opacity-50"
            type="submit"
            disabled={answers.some((a) => a === null)}
          >
            Submit Answers
          </button>
        </form>
      )}
      {score !== null && (
        <div className="mt-6 text-xl font-bold text-green-700">
          Your score: {score} / {questions.length}
        </div>
      )}
    </div>
  );
}
