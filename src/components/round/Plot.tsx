import { SquarePlot } from "@gitcoin/ui";
import { useRound } from "../../providers/RoundProvider";
import { useState, useEffect } from "react";

export const Plot = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const { data } = useRound();

  useEffect(() => {
    // Set initial dimensions
    setWindowDimensions(getWindowDimensions());

    let throttled = false;
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    function handleResize() {
      if (!throttled) {
        setWindowDimensions(getWindowDimensions());
        throttled = true;
        timeoutId = setTimeout(() => {
          throttled = false;
        }, 300);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    }
  }, []);

  // Don't render until we have dimensions
  if (windowDimensions.width === 0) return null;

  if (!data?.plotData) return <p>No plot data</p>;
  return (
    <div className="w-full h-full py-20">
      <div className="max-w-[1000px] mx-auto px-4 flex justify-center">
        <SquarePlot 
          width={windowDimensions.width} 
          labels={data?.plotData.labels} 
          values={data?.plotData.values} 
        />
      </div>
    </div>
  );
};

const getWindowDimensions = () => {
  const { innerWidth, innerHeight } = window;
  return { 
    width: innerWidth > 1000 ? 1000 : innerWidth,
    height: innerHeight 
  };
};

