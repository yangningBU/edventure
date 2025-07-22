export const indexAsLetter = (index) => {
	return String.fromCharCode(65 + index);
};

export const calculateScore = (level, questions, answers) => {
	return questions[level].reduce((total, question, index) => {
		const scoredQuestion = answers[level][index] === question.correctAnswerIndex ? 1 : 0;
		return total + scoredQuestion;
	}, 0);
};