import React from "react";
import { useRound } from "../../providers/RoundProvider";
import { exportLeaderboardToCSV } from "../../utils";

export const Download = () => {
  const { data } = useRound();

  if (!data?.leaderboard) return null;

  const handleDownload = () => {
    exportLeaderboardToCSV(data.leaderboard, data.roundName);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 text-center">
      <button
        onClick={handleDownload}
        className="text-blue-500 hover:text-blue-600 underline text-lg font-medium"
      >
        Download the full funding results.
      </button>
      <p className="text-gray-500 mt-2 text-sm">
        Please note results are going through ratification in our governance process.
      </p>
    </div>
  );
}; 