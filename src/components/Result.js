"use client";
import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin for showing score at the center of the Doughnut chart
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { ctx, width, height } = chart;
    ctx.restore();

    const fontSize = (height / 114).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";

    const score = chart.config.options.score;
    const text = `Score: ${score}`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

const Results = ({
  correct,
  incorrect,
  unattempted,
  totalQuestions,
  onTryAgain,
  questions,
  answers,
}) => {
  const score = correct * 10 - incorrect * 5;
  const correctPercentage = (correct / totalQuestions) * 100;
  const incorrectPercentage = (incorrect / totalQuestions) * 100;
  const unattemptedPercentage = (unattempted / totalQuestions) * 100;
  const [showAnswers, setShowAnswers] = useState(false);

  const toggleShowAnswers = () => {
    setShowAnswers((prev) => !prev);
  };

  const data = {
    labels: ["Correct", "Incorrect", "Unattempted"],
    datasets: [
      {
        data: [correctPercentage, incorrectPercentage, unattemptedPercentage],
        backgroundColor: ["#4caf50", "#e53935", "#fbc02d"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%",
    layout: {
      padding: { bottom: 0 },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 25,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
    },
    score,
  };

  return (
    <div className="flex flex-col gap-y-6 p-4 items-center text-black w-full max-w-sm mx-auto md:max-w-none">
      <p className="text-3xl font-semibold text-center">Quiz by Quiz20</p>
      <p className="text-2xl font-bold text-center">Quiz20</p>

      {/* Doughnut chart */}
      <div className="w-80 h-80">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>

      {/* Statistics for Correct, Incorrect, and Unattempted questions */}
      <div className="flex flex-col sm:flex-row justify-around text-center w-full mt-4 gap-y-4 sm:gap-y-0">
        <p className="text-base sm:text-lg">
          <span className="text-green-600 font-semibold">Correct:</span> {correct} / {totalQuestions}
        </p>
        <p className="text-base sm:text-lg">
          <span className="text-red-600 font-semibold">Incorrect:</span> {incorrect} / {totalQuestions}
        </p>
        <p className="text-base sm:text-lg">
          <span className="text-yellow-600 font-semibold">Unattempted:</span> {unattempted} / {totalQuestions}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-x-2 sm:gap-x-4 mt-4">
        <button onClick={onTryAgain} className="px-6 py-3 bg-black text-white rounded-md text-sm sm:text-base">
          Try Again
        </button>
        <button
          onClick={toggleShowAnswers}
          className="px-6 py-3 bg-black text-white rounded-md text-sm sm:text-base"
        >
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </button>
      </div>

      {/* Answers Section */}
      {showAnswers && (
        <div className="mt-6 w-full max-w-sm sm:max-w-md">
          {questions.map((question, index) => (
            <div key={question.id} className="mb-4 p-4 border rounded-md bg-gray-100">
              <h3 className="text-base sm:text-lg font-semibold">
                Q{index + 1}: {question.question.en}
              </h3>
              <p className="text-sm mt-2">
                <span className="font-semibold">Your Answer:</span> {answers[index] || "Not Answered"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Correct Answer:</span> {question.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
