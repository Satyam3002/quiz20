"use client";
import React from "react";
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

const Results = ({ correct, incorrect, unattempted, totalQuestions, onTryAgain }) => {
  const score = correct * 10 - incorrect * 5; // Calculate score
  const correctPercentage = (correct / totalQuestions) * 100;
  const incorrectPercentage = (incorrect / totalQuestions) * 100;
  const unattemptedPercentage = (unattempted / totalQuestions) * 100;

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
      padding: {
        bottom: 0, // Add padding below the Doughnut chart
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 25, // Space between legend labels and the Doughnut chart
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
    score, // Pass the score to the options so it can be accessed in the plugin
  };

  return (
    <div className="flex flex-col gap-y-6 p-4 items-center text-black">
      <p className="text-4xl font-semibold">Quiz by Quiz20</p>
      <p className="text-3xl font-bold">Quiz20</p>
      
      {/* Doughnut chart */}
      <div className="w-80 h-80 text-sm">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
      
      {/* Statistics for Correct, Incorrect, and Unattempted questions */}
      <div className="pl-12 w-full flex flex-row justify-around text-center mt-4">
        <p className="text-lg">
          <span className="text-green-600 font-semibold">Correct:</span> {correct} / {totalQuestions}
        </p>
        <p className="text-lg">
          <span className="text-red-600 font-semibold">Incorrect:</span> {incorrect} / {totalQuestions}
        </p>
        <p className="text-lg">
          <span className="text-yellow-600 font-semibold">Unattempted:</span> {unattempted} / {totalQuestions}
        </p>
      </div>
      
      <button onClick={onTryAgain} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
        Try Again
      </button>
    </div>
  );
};

export default Results;
