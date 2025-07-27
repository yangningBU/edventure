import { indexAsLetter } from '../utilities.js';
import { isRTL } from '../i18n/t.js';

const FormattedQuestion = ({ question, questionIndex, scoreMark }) => {
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

const Question = ({ level, question, questionIndex, answer, recordAnswer, scored }) => {
    const isCorrect = answer === question.correctAnswerIndex;
    const scoreMark = scored ? isCorrect ? '✅' : '❌' : '';
    const Choice = ({ choice, choiceIndex }) => {
      const isSelected = answer === choiceIndex;
      return (
        <label
          key={choiceIndex}
          className={`flex items-center p-2 rounded border cursor-pointer ${isSelected ? 'border-blue-50 bg-blue-500 text-white' : 'border-gray-200'}`}
          dir={isRTL() ? 'rtl' : 'ltr'}
        >
          <input
            type="radio"
            name={`q${questionIndex}`}
            value={choiceIndex}
            checked={answer === choiceIndex}
            onChange={() => recordAnswer(level, questionIndex, choiceIndex)}
            className="mr-2 ml-2"
          />
          <span>{indexAsLetter(choiceIndex)}. {choice}</span>
        </label>
      )
    }
    return (
      <div className={`mb-6 ${isRTL() ? 'text-right' : 'text-left'}`}>
        <FormattedQuestion question={question} questionIndex={questionIndex} scoreMark={scoreMark} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" style={{direction: isRTL() ? 'rtl' : 'ltr'}}>
          {question.choices.map((choice,choiceIndex) => (
            <Choice key={choiceIndex} choice={choice} choiceIndex={choiceIndex} />
          ))}
        </div>
      </div>
    )
};

export default Question;