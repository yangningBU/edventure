import React, { useState } from 'react';
import Error from './components/Error.jsx';
import LevelTabs from './components/LevelTabs.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import PromptForm from './components/PromptForm.jsx';
import Question from './components/Question.jsx';
import BrandLogo from '/edventure-brand.avif';
import { LEVELS, DEFAULT_LEVEL } from './constants.js';
import { calculateScore } from './utilities.js';
import { isRTL, t } from './i18n.js';

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
        console.log(data.questionsByLevel[level]);
      } else {
        setError(t('error.failedToGenerateQuestions'));
      }
    } catch (err) {
      setError(t('error.serverError'));
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
    const scoreText = isRTL()
      ? `${questions[level].length} / ${score[level]}`
      : `${score[level]} / ${questions[level].length}`;
    return (
      score[level] !== null ? (
        <span className="mt-6 ml-3 mr-3 text-xl font-bold text-green-700" style={{direction: isRTL() ? 'rtl' : 'ltr'}}>
          {t('yourScore')}: {scoreText}
        </span>
      ) : null
    );
  };

  const EmptyExercise = () => {
    return (
      <div className="mt-6 text-xl font-bold text-gray-500">
        {t('noQuestions', { level: t(level) })}
      </div>
    );
  };

  const SubmitAnswersButton = () => (
    <button
      className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-50"
      type="submit"
      disabled={answers[level].some((a) => a === null)}
    >
      {t('submitAnswers')}
    </button>
  )

  const ScoringArea = () => {
    return isRTL()
      ? <><Score /><SubmitAnswersButton /></>
      : <><SubmitAnswersButton /><Score /></>
  } 
       
  const ExerciseQuestions = () => {
    return (
      questions[level].length ? (
        <form onSubmit={handleSubmitAnswers} className={`w-full max-w-2xl p-6 rounded shadow text-${isRTL() ? 'right' : 'left'}`}>
          {questions[level].map((q, i) => (
            <Question key={i} level={level} question={q} questionIndex={i} answer={answers[level][i]} recordAnswer={recordAnswer} scored={score[level] !== null} />
          ))}
          <ScoringArea />
        </form>
      ) : <EmptyExercise />
    );
  };

  const Exercises = () => {
    return loading || noQuestionsAcrossAllLevels ? null : (
      <>
        <h2 className="text-3xl font-bold mb-6 mt-6">{t('exercises')}</h2>
        <LevelTabs level={level} setLevel={setLevel} loading={loading} />
        <ExerciseQuestions />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="flex justify-end w-full max-w-2xl mb-2">
        <LanguageToggle />
      </div>
      <p><a href="https://www.edventureil.com/" target="_blank" rel="noopener noreferrer"><img src={BrandLogo} alt="Edventure Brand Logo" className="w-60 h-25" /></a></p>
      <h1 className="text-3xl font-bold mb-6 mt-4">{t('appTitle')}</h1>
      <p className={`mb-4 w-xl ${isRTL() ? 'text-right' : ''}`}>{t('appDescription')}</p>
      <PromptForm prompt={prompt} setPrompt={setPrompt} loading={loading} handlePromptSubmit={handlePromptSubmit} />
      <Error error={error} />
      <Exercises />
    </div>
  );
}
