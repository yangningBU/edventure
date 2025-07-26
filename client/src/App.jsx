import React, { useEffect,useState } from 'react';
import Error from './components/Error.jsx';
import LevelTabs from './components/LevelTabs.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import PromptForm from './components/PromptForm.jsx';
import Question from './components/Question.jsx';
import BrandLogo from '/edventure-brand.avif';
import { generateQuestions } from './api.js';
import { LEVELS, DEFAULT_LEVEL } from './constants.js';
import { calculateScore } from './utilities.js';
import { ensureLanguageSelection, isRTL, t } from './i18n/t.js';

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

  const noData = Object.values(questions).every(level => level.length === 0);

  useEffect(() => {
    ensureLanguageSelection();
  }, []);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLevel(DEFAULT_LEVEL);
    setScore(generateLevelObject());
    setQuestions(generateLevelObject([]));
    setAnswers(generateLevelObject([]));

    try {
      const response = await generateQuestions(prompt);
      const data = await response.json();

      if (data.questionsByLevel) {
        const questionCount = data.questionsByLevel[level].length;
        const answersByLevel = generateLevelObject(Array(questionCount).fill(null));
        setAnswers(answersByLevel);
        setQuestions(data.questionsByLevel);
      } else {
        setError(t('errorFailedToGenerateQuestions'));
      }
    } catch (err) {
      setError(t('errorServerError'));
    }

    setLoading(false);
  };

  const recordAnswer = (level, questionIndex, answerIndex) => {
    setAnswers((prev) => {
      const currentAnswers = prev[level];
      const updatedAnswers = currentAnswers.map((existingAnswer, i) => (
        i === questionIndex ? answerIndex : existingAnswer
      ));
      return {...prev, [level]: updatedAnswers}
    });
  };

  const handleSubmitAnswers = (e) => {
    e.preventDefault();
    setScore((prev) => ({
      ...prev,
      [level]: calculateScore(questions[level], answers[level])
    }));
  };

  const Score = () => {
    const scoreText = isRTL()
      ? `${questions[level].length} / ${score[level]}`
      : `${score[level]} / ${questions[level].length}`;
    return (
      score[level] === null ? null : (
        <span className="mt-6 ml-3 mr-3 text-xl font-bold text-green-700" style={{direction: isRTL() ? 'rtl' : 'ltr'}}>
          {t('yourScore')}: {scoreText}
        </span>
      )
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

  const Questions = () => {
    return (
      <>
        {questions[level].map((q, i) => (
          <Question
            key={i}
            level={level}
            question={q}
            questionIndex={i}
            answer={answers[level][i]}
            recordAnswer={recordAnswer}
            scored={score[level] !== null}
          />
        ))}
      </>
    );
  }

  const ExerciseQuestions = () => {
    return (
      questions[level].length ? (
        <form onSubmit={handleSubmitAnswers} className={`w-full max-w-2xl p-6 rounded shadow text-${isRTL() ? 'right' : 'left'}`}>
          <Questions />
          <ScoringArea />
        </form>
      ) : <EmptyExercise />
    );
  };

  const Exercises = () => {
    return loading || noData ? null : (
      <div className="flex flex-col w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-6 mt-6">{t('exercises')}</h2>
        <LevelTabs level={level} setLevel={setLevel} loading={loading} />
        <ExerciseQuestions />
      </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="flex justify-end w-full max-w-2xl mb-2">
        <LanguageToggle />
      </div>
      <p>
        <a href="https://www.edventureil.com/" target="_blank">
          <img src={BrandLogo} alt="Edventure Brand Logo" className="w-50 h-auto" />
        </a>
      </p>
      <h1 className="text-3xl font-bold mb-6 mt-4">{t('appTitle')}</h1>
      <p className={`mb-4 w-full max-w-xl ${isRTL() ? 'text-right' : ''}`}>{t('appDescription')}</p>
      <PromptForm prompt={prompt} setPrompt={setPrompt} loading={loading} handlePromptSubmit={handlePromptSubmit} />
      <Error error={error} />
      <Exercises />
    </div>
  );
}
