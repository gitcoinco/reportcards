import React from "react";
import { ShareButton } from "./ShareButton";

export const ShareResults = () => {

  return (
    <div className="max-w-[900px] mx-auto bg-[#e8f5e9] p-6 rounded-lg flex items-center justify-center gap-4">
      <span className="text-gray-800 font-medium">Share the results</span>
      <ShareButton  />
    </div>
  );
}; 