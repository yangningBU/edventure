import { alphabetStartingCode } from './i18n/t.js';

export const indexAsLetter = (index) => {
	// Start with the first letter of the alphabet in the
	// current language and add the index to get the given
	// question's letter marker.
	return String.fromCharCode(alphabetStartingCode() + index);
};

export const calculateScore = (questions, answers) => {
	return questions.reduce((total, question, index) => {
		const scoredQuestion = answers[index] === question.correctAnswerIndex ? 1 : 0;
		return total + scoredQuestion;
	}, 0);
};