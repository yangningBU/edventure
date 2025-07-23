const DEFAULT_LANG = 'en';

const translations = {
  en: {
    appTitle: 'AI Exercise Generator',
    appDescription: 'Submit a topic and you\'ll get three sets of exercises to answer questions about it in increasing difficulty. Enter your responses to see how well you score.',
    beginner: 'beginner',
    beginnerTitle: 'Beginner',
    intermediate: 'intermediate',
    intermediateTitle: 'Intermediate',
    errorFailedToGenerateQuestions: 'Failed to generate questions.',
    errorServerError: 'Server error.',
    expert: 'expert',
    expertTitle: 'Expert',
    exercises: 'Exercises',
    firstNumeralLetterCode: 65,
    submitAnswers: 'Submit Answers',
    yourScore: 'Your score',
    noQuestions: 'No {level} questions available.',
    loading: 'Loading...',
    promptPlaceholder: 'Enter a topic or prompt...',
    generateQuestions: 'Generate Questions',
    generating: 'Generating...'
  },
  he: {
    appTitle: 'מחולל תרגולים',
    appDescription: 'הזינו נושא ותקבלו שלוש רמות של תרגולים במגוון רמות קושי. ענו על השאלות וגלו את הציון שלכם',
    beginner: 'מתחילים',
    beginnerTitle: 'מתחילים',
    intermediate: 'ביניים',
    intermediateTitle: 'ביניים',
    errorFailedToGenerateQuestions: 'יצירת השאלות נכשלה',
    errorServerError: 'שגיאת שרת.',
    expert: 'מומחים',
    expertTitle: 'מומחים',
    exercises: 'תרגולים',
    firstNumeralLetterCode: 1488,
    submitAnswers: 'שלח תשובות',
    yourScore: 'הציון שלך',
    noQuestions: '{level} אין שאלות ברמת',
    loading: 'טוען...',
    promptPlaceholder: '...הזן נושא או הנחיה',
    generateQuestions: 'צור שאלות',
    generating: '...יוצר שאלות'
  }
};

export function currentLang() {
  return localStorage.getItem('lang') || DEFAULT_LANG;
}

export function getLang() {
  return currentLang();
} 

export function setLang(lang) {
  if (translations[lang]) {
    localStorage.setItem('lang', lang);
  }
}

export function isRTL() {
  return currentLang() === 'he';
}

export function t(key, vars = {}) {
  let str = translations[currentLang()][key] || key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}