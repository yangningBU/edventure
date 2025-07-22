import React, { useState } from 'react';
import Error from './components/Error.jsx';
import PromptForm from './components/PromptForm.jsx';
import Question from './components/Question.jsx';
import { indexAsLetter } from './utilities.js';

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

  const recordAnswer = (qIdx, aIdx) => {
    const correctAnswerIndex = getCorrectAnswerIndex(qIdx);
    const isCorrect = aIdx === correctAnswerIndex;
    console.log(`Q${qIdx + 1}, Ans => ${indexAsLetter(aIdx)}, correct? ${isCorrect ? 'yes' : 'no'}`);
    setAnswers((prev) => prev.map((ans, i) => (i === qIdx ? aIdx : ans)));
  };

  const scoreAnswers = () => {
    return questions.reduce((total, question, index) => {
      const scoredQuestion = answers[index] === question.correctAnswerIndex ? 1 : 0;
      return total + scoredQuestion;
    }, 0);
  };

  const handleSubmitAnswers = (e) => {
    e.preventDefault();
    setScore(scoreAnswers());
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6 mt-4">AI Exercise Generator</h1>
      <PromptForm prompt={prompt} setPrompt={setPrompt} loading={loading} handlePromptSubmit={handlePromptSubmit} />
      <Error error={error} />
      {questions.length > 0 && !loading && (
        <form onSubmit={handleSubmitAnswers} className="w-full max-w-2xl p-6 rounded shadow">
          {questions.map((q, i) => (
            <Question key={i} question={q} questionIndex={i} answer={answers[i]} recordAnswer={recordAnswer} />
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
