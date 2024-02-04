import React, { useEffect, useState } from 'react';
import Tooltip from './Tooltip';

function decodeHtml(html) {
  if (typeof window === "undefined") {
    return html;
  }
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

const strategiesTips = {
  "Decomposition": "Break down a complex question into simpler parts to better assess its truth.",
  "Avoiding Anchoring": "Consider different angles of the question before settling on your initial impression.",
  "Equivalent Bets": "Think of what you would bet on the outcome being true or false.",
  "Feedback and Record Keeping": "Reflect on previous questions where your confidence was misplaced.",
  "Overconfidence Calibration": "Adjust your confidence level if you feel too certain without strong evidence.",
  "Scenario Analysis": "Imagine scenarios where the statement could be true and false.",
  "Seeking Disconfirming Evidence": "Actively look for information that could prove the statement wrong.",
  "Diverse Viewpoints": "Consider how someone with a different perspective might view the statement."
};

const ResultModal = ({ correctPercentage, averageConfidence, correctConfidence, wrongConfidence, onRestart }) => {
  // Determine performance type
  const performanceType = averageConfidence > correctPercentage ? "overconfident" : "underconfident";

  // Generate feedback based on performance
  const generateFeedback = () => {
    if (performanceType === "overconfident") {
      return (
        <>
          <h1 className="font-bold text-xl mt-4 text-center">Feedback</h1>
          <h2 className="font-bold text-lg mt-4 text-center">You may be over-confident</h2>
          <p className="text-center">Over-confidence can lead to poor decision-making and missed learning opportunities.<br/>Consider these strategies to improve your performance:</p>
          <br/>
          <ul className="text-left ml-12">
            <li style={{ listStyleType: "disc" }}>{strategiesTips["Feedback and Record Keeping"]}</li>
            <li style={{ listStyleType: "disc" }}>{strategiesTips["Overconfidence Calibration"]}</li>
            <li style={{ listStyleType: "disc" }}>{strategiesTips["Seeking Disconfirming Evidence"]}</li>
          </ul>
        </>
      );
    } else {
      return (
        <>
          <h1 className="font-bold text-xl mt-4 text-center">Feedback</h1>
          <h2 className="font-bold text-lg mt-4 text-center">You may be under-confident</h2>
          <p className="text-center">Under-confidence can lead to missed opportunities and a lack of assertiveness.<br/>Consider these strategies to improve your performance:</p>
          <br/>
          <ul className="text-left ml-12">
            <li style={{ listStyleType: "disc" }}>{strategiesTips["Decomposition"]}</li>
            <li style={{ listStyleType: "disc" }}>{strategiesTips["Scenario Analysis"]}</li>
            <li style={{ listStyleType: "disc" }}>{strategiesTips["Diverse Viewpoints"]}</li>
          </ul>
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg text-center">
        <h2 className="font-bold text-xl mb-4">Quiz Results</h2>
        <p>Average Confidence: {averageConfidence}%</p>
        <p>Correct Answers: {correctPercentage}%</p>
        <p>Confidence for Correct Answers: {correctConfidence}%</p>
        <p>Confidence for Wrong Answers: {wrongConfidence}%</p>
        {/* Feedback Section */}
        <div className="mt-4 text-left">
          {generateFeedback()}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
          onClick={onRestart}
        >
          Retake Test
        </button>
      </div>
    </div>
  );
};


const App = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({});
  const [testStarted, setTestStarted] = useState(false); // New state to track if the test has started

  useEffect(() => {
    if (testStarted) { // Fetch questions only after test starts
      fetch('https://opentdb.com/api.php?amount=10&type=boolean')
        .then((res) => res.json())
        .then(data => {
          const decodedQuestions = data.results.map((question) => ({
            ...question,
            question: decodeHtml(question.question),
          }));
          setQuestions(decodedQuestions);
        })
        .catch((error) => console.error('Error fetching questions:', error));
    }
  }, [testStarted]); // Dependency array now includes testStarted

  const handleStartTest = () => {
    setTestStarted(true); // Function to start the test
  };

  if (!testStarted) { // Conditionally render introduction or quiz based on testStarted
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="border p-8 max-w-4xl w-full rounded-lg shadow-lg bg-white">
          <h1 className="text-4xl font-bold mb-4 text-center">Welcome to the Calibrated Probability Assessment!</h1>
          <p className="mb-4 text-left">This quiz will help you assess how well you can predict the correct answer and how confident you are in your predictions.</p>
          <p className="mb-4 text-left">Calibrated probability assessments provide a powerful tool for enhancing the accuracy of subjective probability estimates, crucial in fields like cybersecurity and risk management. This method improves decision-making by allowing individuals to refine their estimates based on real outcomes, moving from guesswork to a more objective understanding of uncertainties. It offers a disciplined approach to dealing with uncertainty, significantly benefiting areas where precise risk evaluation is essential. Through continuous learning and adjustment, calibrated probabilities help in better anticipating and mitigating potential threats, thereby elevating the quality of decisions in high-stakes environments.</p>
          <h2 className="text-2xl font-bold mb-4 text-center">Instructions</h2>
          <p className="mb-4 text-left">You will be presented with 30 true or false questions. For each question, select an answer and indicate your confidence in your choice. Once you have answered all the questions, you will receive your results.</p>
          <p className="mb-4 text-left">Your goal is to have your confidence and % correct converge regardless of actual subject-matter knowledge.</p>
          <h2 className="text-2xl font-bold mb-4 text-center">Strategies</h2>
          <ul className="list-disc pl-5 space-y-2 text-left">
            <li><strong>Decomposition:</strong> Break down complex problems into simpler, more manageable components to make the overall estimation process more accurate.</li>
            <li><strong>Avoiding Anchoring:</strong> Practice adjusting estimates as new information becomes available to prevent early data from disproportionately influencing your judgment.</li>
            <li><strong>Equivalent Bets:</strong> Frame probability assessments in terms of bets with equivalent outcomes to make it easier to gauge the likelihood of different events.</li>
            <li><strong>Feedback and Record Keeping:</strong> Compare your probability estimates against actual outcomes and keep detailed records to adjust and refine future assessments.</li>
            <li><strong>Overconfidence Calibration:</strong> Estimate probability ranges for your predictions to recognize and adjust for personal bias towards certainty.</li>
            <li><strong>Scenario Analysis:</strong> Develop and analyze a range of possible outcomes, including best-case, worst-case, and most likely scenarios.</li>
            <li><strong>Seeking Disconfirming Evidence:</strong> Look for information that contradicts your current beliefs to mitigate confirmation bias.</li>
            <li><strong>Diverse Viewpoints:</strong> Incorporate perspectives from a variety of sources to improve the accuracy of your probability estimates.</li>
          </ul>
          <br/>
          <p className="mb-4 text-center">Click the button below to start the test.</p>
          <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300"
            onClick={handleStartTest}
          >
            Start Test
          </button>
        </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const correctAnswersCount = questions.filter((q) =>
      q.correct_answer === answers[q.question]?.answer
    ).length;
    const totalQuestions = questions.length;
    const totalConfidence = Object.values(answers).reduce((acc, curr) => acc + Number(curr.confidence), 0);
    const averageConfidence = (totalConfidence / totalQuestions).toFixed(2);
    const correctConfidenceSum = Object.values(answers).filter((a, i) => questions[i].correct_answer === a.answer).reduce((acc, curr) => acc + Number(curr.confidence), 0);
    const wrongConfidenceSum = Object.values(answers).filter((a, i) => questions[i].correct_answer !== a.answer).reduce((acc, curr) => acc + Number(curr.confidence), 0);
    const correctConfidence = correctAnswersCount > 0 ? (correctConfidenceSum / correctAnswersCount).toFixed(2) : "0.00";
    const wrongAnswersCount = totalQuestions - correctAnswersCount;
    const wrongConfidence = wrongAnswersCount > 0 ? (wrongConfidenceSum / wrongAnswersCount).toFixed(2) : "0.00";

    setResultData({
      averageConfidence,
      correctPercentage: ((correctAnswersCount / totalQuestions) * 100).toFixed(2),
      correctConfidence,
      wrongConfidence,
    });

    setShowResult(true);
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.question]?.answer);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {showResult ? (
        <ResultModal
          correctPercentage={resultData.correctPercentage}
          averageConfidence={resultData.averageConfidence}
          correctConfidence={resultData.correctConfidence}
          wrongConfidence={resultData.wrongConfidence}
          onRestart={handleRestart}
        />
      ) : (
        <div className="border p-8 mb-10 text-center max-w-4xl w-full rounded-lg shadow-lg bg-white">
          {questions && questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={index} className="mb-6">
                <p className="text-lg font-semibold mb-2">
                  {`${index + 1}. ${question.question}`}
                </p>
                <div className="flex justify-center items-center space-x-2">
                  <button
                    className={`px-4 py-2 rounded-md transition duration-300 ${answers[question.question]?.answer === 'True' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    onClick={() => setAnswers({
                      ...answers,
                      [question.question]: { ...answers[question.question], answer: 'True', confidence: answers[question.question]?.confidence || '50' },
                    })}
                  >
                    True
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md transition duration-300 ${answers[question.question]?.answer === 'False' ? 'bg-red-700 text-white' : 'bg-red-500 text-white hover:bg-red-700'}`}
                    onClick={() => setAnswers({
                      ...answers,
                      [question.question]: { ...answers[question.question], answer: 'False', confidence: answers[question.question]?.confidence || '50' },
                    })}
                  >
                    False
                  </button>
                  <select
                    className="form-select px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    value={answers[question.question]?.confidence || '50'}
                    onChange={(e) => setAnswers({
                      ...answers,
                      [question.question]: { ...answers[question.question], confidence: e.target.value, answer: answers[question.question]?.answer || '' },
                    })}
                  >
                    {Array.from({ length: 6 }, (_, i) => (50 + i * 10)).map((val) => (
                      <option key={val} value={val}>{val}%</option>
                    ))}
                  </select>
                  <Tooltip message={strategiesTips[Object.keys(strategiesTips)[index % Object.keys(strategiesTips).length]]} />
                </div>
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
          <div className="text-center mt-10 space-x-4">
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
