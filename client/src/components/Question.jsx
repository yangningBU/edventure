import { indexAsLetter } from '../utilities.js';
import { isRTL } from '../i18n/t.js';

const Question = ({ level, question, questionIndex, answer, recordAnswer, scored }) => {
    const isCorrect = answer === question.correctAnswerIndex;
    const scoreMark = scored ? isCorrect ? '✅' : '❌' : '';
    const FormattedQuestion = () => {
        // Disclaimer: supporting both LTR and RTL languages in one UI is tricky!!
        // In Hebrew we get the question text with the question mark in the wrong place.
        // So here we're removing it and adding it back in the correct place.
        // Further down you'll see we're using the invisible LTR \u200e; character to force
        // the number and period characters of the question to be displayed in the correct direction.
        const questionTextWithoutQuestionMark = question.question.replace(/\?$/, '');
        return (
            <div className="font-semibold mb-2">
                {isRTL() ?
                <>
                    <span>?</span><span>{questionTextWithoutQuestionMark}</span>{'\u200e'}.<span>{questionIndex + 1}</span>
                    <span className="ml-2">{scoreMark}</span>
                </> :
                <>
                    <span className="mr-2">{scoreMark}</span>
                    <span>{questionIndex + 1}</span>. <span>{questionTextWithoutQuestionMark}</span><span>?</span>
                </>
            }
            </div>
        )
    };
    return (
        <div className={`mb-6 ${isRTL() ? 'text-right' : ''}`}>
            <FormattedQuestion />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" style={{direction: isRTL() ? 'rtl' : 'ltr'}}>
            {question.choices.map((choice, optionIndex) => (
                <label
                    key={optionIndex}
                    className={`flex items-center p-2 rounded border cursor-pointer ${answer === optionIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    dir={isRTL() ? 'rtl' : 'ltr'}
                >
                    <input
                        type="radio"
                        name={`q${questionIndex}`}
                        value={optionIndex}
                        checked={answer === optionIndex}
                        onChange={() => recordAnswer(level, questionIndex, optionIndex)}
                        className="mr-2 ml-2"
                    />
                    <span>{indexAsLetter(optionIndex)}. {choice}</span>
                </label>
            ))}
            </div>
        </div>
    )
};

export default Question;