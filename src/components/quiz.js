"use client";
import { useState, useEffect } from "react";
import Results from "./Result";

const questions = [
  {
    id: 1,
    question: { en: "What is the capital of France?", hi: "फ्रांस की राजधानी क्या है?" },
    options: {
      en: ["Berlin", "Madrid", "Paris", "Rome"],
      hi: ["बर्लिन", "मैड्रिड", "पेरिस", "रोम"],
    },
    answer: "Paris",
  },
  {
    id: 2,
    question: { en: "Which planet is known as the Red Planet?", hi: "कौन सा ग्रह लाल ग्रह के रूप में जाना जाता है?" },
    options: {
      en: ["Earth", "Mars", "Jupiter", "Venus"],
      hi: ["पृथ्वी", "मंगल", "बृहस्पति", "शुक्र"],
    },
    answer: "Mars",
  },
  {
    id: 3,
    question: { en: "What is the largest mammal?", hi: "सबसे बड़ा स्तनपायी क्या है?" },
    options: {
      en: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      hi: ["हाथी", "नीली व्हेल", "जिराफ", "दरियाई घोड़ा"],
    },
    answer: "Blue Whale",
  },
  {
    id: 4,
    question: { en: "Which element has the chemical symbol 'O'?", hi: "कौन सा तत्व 'O' रासायनिक प्रतीक है?" },
    options: {
      en: ["Osmium", "Oxygen", "Gold", "Silver"],
      hi: ["ऑस्मियम", "ऑक्सीजन", "सोना", "चांदी"],
    },
    answer: "Oxygen",
  },
  {
    id: 5,
    question: { en: "Who wrote 'Hamlet'?", hi: "हैमलेट' किसने लिखा?" },
    options: {
      en: ["Charles Dickens", "J.K. Rowling", "Mark Twain", "William Shakespeare"],
      hi: ["चार्ल्स डिकेन्स", "जे.के. राउलिंग", "मार्क ट्वेन", "विलियम शेक्सपियर"],
    },
    answer: "William Shakespeare",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [darkMode, setDarkMode] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [unattempted, setUnattempted] = useState(0);
  const [language, setLanguage] = useState("en"); // "en" for English, "hi" for Hindi

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correctCount += 1;
      } else if (answers[index] !== undefined) {
        incorrectCount += 1;
      }
    });

    setCorrect(correctCount);
    setIncorrect(incorrectCount);
    setUnattempted(questions.length - correctCount - incorrectCount);
    setShowResults(true); // Show results when submitted
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(60); // Reset time left
  };

  const handleShare = () => {
    const currentQ = questions[currentQuestion];
    const shareText = `${currentQ.question[language]} \nOptions: ${currentQ.options[language].join(', ')}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Question copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "hi" : "en"));
  };

  const handleConfirmSubmit = () => {
    setConfirmSubmit(true); // Show confirmation modal
  };

  const handleConfirmYes = () => {
    setConfirmSubmit(false);
    handleSubmit(); // Proceed with submit
  };

  const handleConfirmNo = () => {
    setConfirmSubmit(false); // Close modal
  };

  if (showResults) {
    return (
      <Results
        correct={correct}
        incorrect={incorrect}
        unattempted={unattempted}
        totalQuestions={questions.length}
        onTryAgain={handleTryAgain}
        questions={questions}
        answers={answers}
      />
    );
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "bg-customBlack text-white" : "bg-white text-black"}`}>
    {/* Navbar */}
    <div className={`flex p-3 ${darkMode ? "bg-customGreen text-black" : "bg-black text-white"} justify-between items-center`}>
      <div className="text-3xl sm:text-2xl md:text-4xl font-bold">Quiz20</div>
      <p className="text-xl sm:text-lg md:text-3xl text-black bg-white p-1 px-3 sm:px-2 md:px-4 rounded-3xl font-bold">
        00:{timeLeft}
      </p>
      <button onClick={toggleDarkMode} className="px-2 sm:px-1 md:px-4 py-1 sm:py-0.5 md:py-2 bg-blue-500 text-white rounded-md text-sm sm:text-xs md:text-base">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  
    {/* Submit Button */}
    <div className="p-3 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="font-semibold text-lg sm:text-base md:text-2xl">Quiz by Quiz20</p>
      <button onClick={handleConfirmSubmit} className={`w-full sm:w-auto  py-2 text-sm md:text-xl px-20 sm:px-10 md:px-72 rounded-md ${darkMode ? "bg-customBlue" : "bg-customBlue"} text-white`}>
        Submit
      </button>
    </div>
  
    {/* Quiz Container */}
    <div className="flex-grow flex flex-col justify-between p-4">
      <div className="mb-4">
        {/* Question Number Indicator */}
        <p className="text-sm sm:text-base md:text-lg font-normal text-blue-700">
          {language === "en" ? "Question" : "प्रश्न"} {currentQuestion + 1} {language === "en" ? "out of" : "में से"} {questions.length}
        </p> 
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold">{questions[currentQuestion].question[language]}</h2>
          <div className="flex gap-2"> 
            <button onClick={toggleLanguage} className="w-8 h-8 sm:w-10 sm:h-10 bg-lightGray rounded-full flex items-center justify-center">
              <img src="/translate.svg" alt="Translate" className="w-6 h-6 sm:w-8 sm:h-8" />      
            </button>
            <button onClick={handleShare} className="w-8 h-8 sm:w-10 sm:h-10 bg-lightGray rounded-full flex items-center justify-center">
              <img src="/share.svg" alt="Translate" className="w-6 h-6 sm:w-8 sm:h-8" />      
            </button>
          </div>
        </div>
  
        <div className="grid gap-2 sm:gap-4 mt-2">
          {questions[currentQuestion].options[language].map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`relative flex items-center py-2 sm:py-3 rounded-md overflow-hidden transition-transform duration-200 ${
                answers[currentQuestion] === option ? "border-4 border-blue-500 pl-3 sm:pl-4" : "border-white"
              } ${darkMode ? "text-white" : "text-black"}`}
            >
              {/* Gray fill effect */}
              {answers[currentQuestion] === option && <span className="absolute inset-0 bg-gray-300 animate-fill"></span>}
              {/* Circular button for alphabet */}
              <span className="flex items-center justify-center w-8 sm:w-10 bg-customGray h-8 sm:h-10 mr-2 sm:mr-3 rounded-full text-center font-bold text-black">
                {String.fromCharCode(65 + index)} {/* A, B, C, etc. */}
              </span>
              {/* Answer text */}
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  
    {/* Navigation Buttons at the Bottom */}
    <div className="flex gap-2 sm:gap-4 justify-between p-2 sm:p-4">
      <button
        disabled={currentQuestion === 0}
        onClick={() => setCurrentQuestion(currentQuestion - 1)}
        className={`px-2 sm:px-4 py-3 sm:py-4 w-1/2 rounded-md ${darkMode ? "bg-lightGreen text-black" : "bg-lightGray text-white"} text-sm sm:text-base`}
      >
        {language === "en" ? "Previous" : "पिछला"}
      </button>
      <button
        disabled={currentQuestion === questions.length - 1}
        onClick={() => setCurrentQuestion(currentQuestion + 1)}
        className={`px-2 sm:px-4 py-3 sm:py-4 w-1/2 rounded-md ${darkMode ? "bg-customGreen text-black" : "bg-black text-white"} text-sm sm:text-base`}
      >
        {language === "en" ? "Next" : "अगला"}
      </button>
    </div>
    
    {/* Confirmation Modal */}
    {confirmSubmit && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md">
          <p className="text-xl sm:text-3xl font-semibold text-red-700 mb-2 sm:mb-4">
            {language === "en" ? "Submit Quiz?" : "क्या आप वाकई सबमिट करना चाहते हैं?"}
          </p>
          <p className="mb-4 text-sm sm:text-base text-black font-semibold">
            {language === "en" ? ` Unattempted Questions: ${unattempted}` : ` अप्रयासित: ${unattempted}`}
          </p>
          <p className="text-sm sm:text-lg font-semibold mb-4 text-black">
            {language === "en" ? "Once submitted, you cannot modify your answers." : "सबमिट करने के बाद, आप अपने उत्तरों में संशोधन नहीं कर सकते।"}
          </p>
          <div className="flex gap-2 sm:gap-4 justify-center">
            <button onClick={handleConfirmYes} className="px-4 py-2 sm:px-6 bg-green-500 text-white rounded-md text-sm sm:text-base">
              Yes
            </button>
            <button onClick={handleConfirmNo} className="px-4 py-2 sm:px-6 bg-red-500 text-white rounded-md text-sm sm:text-base">
              No
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  
  );
}
