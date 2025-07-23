import { t } from './i18n.js';

export const indexAsLetter = (index) => {
	const alphabetStartingCode = t('firstNumeralLetterCode');
	return String.fromCharCode(alphabetStartingCode + index);
};

export const calculateScore = (level, questions, answers) => {
	return questions[level].reduce((total, question, index) => {
		const scoredQuestion = answers[level][index] === question.correctAnswerIndex ? 1 : 0;
		return total + scoredQuestion;
	}, 0);
};