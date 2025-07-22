import { indexAsLetter } from '../utilities';

const Question = ({ question, questionIndex, answer, recordAnswer }) => {
    return (
        <div className="mb-6">
            <div className="font-semibold mb-2">{questionIndex + 1}. {question.question}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.choices.map((choice, optionIndex) => (
                <label key={optionIndex} className={`flex items-center p-2 rounded border cursor-pointer ${answer === optionIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <input
                        type="radio"
                        name={`q${questionIndex}`}
                        value={optionIndex}
                        checked={answer === optionIndex}
                        onChange={() => recordAnswer(questionIndex, optionIndex)}
                        className="mr-2"
                    />
                    <span>{indexAsLetter(optionIndex)}. {choice}</span>
                </label>
            ))}
            </div>
        </div>
    )
};

export default Question;