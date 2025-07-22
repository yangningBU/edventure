import React, { useState } from 'react';
import Error from './components/Error.jsx';
import LevelTabs from './components/LevelTabs.jsx';
import PromptForm from './components/PromptForm.jsx';
import Question from './components/Question.jsx';
import BrandLogo from '/edventure-brand.avif';
import { LEVELS, DEFAULT_LEVEL } from './constants.js';
import { calculateScore } from './utilities.js';

const API_URL = `${import.meta.env.VITE_API_HOST || 'http://localhost:3002'}/generate-questions`;

export default function App() {
  const generateLevelObject = (levelValue = null) => (
    Object.fromEntries(LEVELS.map(level => [level, levelValue]))
  );

  const [prompt, setPrompt] = useState('');
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [questions, setQuestions] = useState(generateLevelObject([]));
  const [answers, setAnswers] = useState(generateLevelObject([]));
  const [score, setScore] = useState(generateLevelObject());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const noQuestionsAcrossAllLevels = Object.values(questions).every(level => level.length === 0);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLevel(DEFAULT_LEVEL);
    setScore(generateLevelObject());
    setQuestions(generateLevelObject([]));
    setAnswers(generateLevelObject([]));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (data.questionsByLevel) {
        const questionCount = data.questionsByLevel[level].length;
        const answersByLevel = generateLevelObject(Array(questionCount).fill(null));
        setAnswers(answersByLevel);
        setQuestions(data.questionsByLevel);
      } else {
        setError('Failed to generate questions.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  };

  const recordAnswer = (level, qIdx, aIdx) => {
    setAnswers((prev) => {
      const currentAnswers = prev[level];
      const updatedLevel = currentAnswers.map((ans, i) => (i === qIdx ? aIdx : ans));
      return {...prev, [level]: updatedLevel}
    });
  };

  const handleSubmitAnswers = (e) => {
    e.preventDefault();
    setScore((prev) => ({
      ...prev,
      [level]: calculateScore(level, questions, answers)
    }));
  };

  const Score = () => {
    return (
      score[level] !== null ? (
        <span className="mt-6 ml-3 text-xl font-bold text-green-700">
          Your score: {score[level]} / {questions[level].length}
        </span>
      ) : null
    );
  };

  const EmptyExercise = () => {
    return (
      <div className="mt-6 text-xl font-bold text-gray-500">
        No {level} questions available.
      </div>
    );
  };

  const ExerciseQuestions = () => {
    return (
      questions[level].length ? (
        <form onSubmit={handleSubmitAnswers} className="w-full max-w-2xl p-6 rounded shadow">
          {questions[level].map((q, i) => (
            <Question key={i} level={level} question={q} questionIndex={i} answer={answers[level][i]} recordAnswer={recordAnswer} scored={score[level] !== null} />
          ))}
          <button
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition disabled:opacity-50"
            type="submit"
            disabled={answers[level].some((a) => a === null)}
          >
            Submit Answers
          </button>
          <Score />
        </form>
      ) : <EmptyExercise />
    );
  };

  const Exercises = () => {
    return loading || noQuestionsAcrossAllLevels ? null : (
      <>
        <h2 className="text-3xl font-bold mb-6 mt-6">Exercises</h2>
        <LevelTabs level={level} setLevel={setLevel} loading={loading} />
        <ExerciseQuestions />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <p><a href="https://www.edventureil.com/" target="_blank" rel="noopener noreferrer"><img src={BrandLogo} alt="Edventure Brand Logo" className="w-60 h-25" /></a></p>
      <h1 className="text-3xl font-bold mb-6 mt-4">AI Exercise Generator</h1>
      <p className="mb-4 w-xl">Submit a topic and you'll get three sets of exercises to answer questions about it in increasing difficulty. Enter your responses to see how well you score.</p>
      <PromptForm prompt={prompt} setPrompt={setPrompt} loading={loading} handlePromptSubmit={handlePromptSubmit} />
      <Error error={error} />
      <Exercises />
    </div>
  );
}
