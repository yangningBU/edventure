import React, { useState } from 'react';
import Error from './components/Error.jsx';
import PromptForm from './components/PromptForm.jsx';
import Question from './components/Question.jsx';
import BrandLogo from '/edventure-brand.avif';
import { indexAsLetter } from './utilities.js';

const API_URL = `${import.meta.env.VITE_API_HOST || 'http://localhost:3002'}/generate-questions`;

export default function App() {
  const LEVELS = ['beginner', 'intermediate', 'expert'];
  const DEFAULT_LEVEL = 'expert';
  const getEmptyLevelObject = (defaultValue = null) => (
    Object.fromEntries(LEVELS.map(level => [level, defaultValue]))
  );

  const [prompt, setPrompt] = useState('');
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [questions, setQuestions] = useState(getEmptyLevelObject([]));
  const [answers, setAnswers] = useState(getEmptyLevelObject([]));
  const [score, setScore] = useState(getEmptyLevelObject());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCorrectAnswerIndex = (level,qIdx) => {
    return questions[level][qIdx].correctAnswerIndex;
  };
  const noQuestions = () => {
    return Object.keys(questions).every(level => questions[level].length === 0);
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLevel(DEFAULT_LEVEL);
    setScore(getEmptyLevelObject());
    setQuestions(getEmptyLevelObject([]));
    setAnswers(getEmptyLevelObject([]));

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.questionsByLevel) {
        const levels = Object.keys(data.questionsByLevel);
        const answersByLevel = Object.fromEntries(
          levels.map((level) => [
            level,
            Array(data.questionsByLevel[level].length).fill(null)
          ])
        );
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
    const correctAnswerIndex = getCorrectAnswerIndex(level, qIdx);
    const isCorrect = aIdx === correctAnswerIndex;
    console.log(`Level ${level}, Q${qIdx + 1}, Ans => ${indexAsLetter(aIdx)}, correct? ${isCorrect ? 'yes' : 'no'}`);
    setAnswers((prev) => ({ ...prev, [level]: prev[level].map((ans, i) => (i === qIdx ? aIdx : ans)) }));
  };

  const scoreAnswers = () => {
    return questions[level].reduce((total, question, index) => {
      const scoredQuestion = answers[level][index] === question.correctAnswerIndex ? 1 : 0;
      return total + scoredQuestion;
    }, 0);
  };

  const handleSubmitAnswers = (e) => {
    e.preventDefault();
    setScore((prev) => ({ ...prev, [level]: scoreAnswers() }));
  };

  const ExerciseQuestions = () => {
    return (
      questions[level].length > 0 && !loading ? (
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
      ) : null
    );
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
      <div className="mt-6 text-xl font-bold text-green-700">
        No questions available for this level.
      </div>
    );
  };


  const Exercise = () => {
    return questions[level].length === 0 ? <EmptyExercise /> : (
      <>
        <ExerciseQuestions />
      </>
    );
  };

  const LevelTabs = () => {
    return (
      <div className="flex space-x-2 mb-6">
        {LEVELS.map((lvl) => {
          return (
            <button
              key={lvl}
              className={`px-4 py-2 rounded-t font-semibold transition-colors duration-200 ${level === lvl ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'} bg-gray-100`}
              onClick={() => setLevel(lvl)}
              disabled={loading}
            >
              {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          )
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <p><a href="https://www.edventureil.com/" target="_blank" rel="noopener noreferrer"><img src={BrandLogo} alt="Edventure Brand Logo" className="w-60 h-25" /></a></p>
      <h1 className="text-3xl font-bold mb-6 mt-4">AI Exercise Generator</h1>
      <p className="mb-4 w-xl">Submit a topic and get three sets of exercises to answer. Record your responses and see how well you scored.</p>
      <PromptForm prompt={prompt} setPrompt={setPrompt} loading={loading} handlePromptSubmit={handlePromptSubmit} />
      <Error error={error} />
      {noQuestions() ? null : (
        <>
          <LevelTabs />
          <Exercise />
        </>
      )}
    </div>
  );
}
