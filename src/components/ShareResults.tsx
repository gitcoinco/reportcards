import { ShareButton } from "./ShareButton";

export const ShareResults = () => {

  return (
    <div className="w-[400px] mx-auto bg-[#e8f5e9] p-6 rounded-lg flex items-center justify-center gap-4">
      <span className="text-gray-800 font-medium">Share the results</span>
      <ShareButton  />
    </div>
  );
}; 