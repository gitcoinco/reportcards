import { RoundHeader } from "../components/RoundHeader";
import { StatDescription } from "../components/StatDescription";
import { RoundStats } from "../components/RoundStats";
import { useRound } from "../providers/RoundProvider";
import { Plot } from "../components/Plot";
import { Leaderboard } from "../components/Leaderboard";
import { Download } from "../components/Download";
import { ShareResults } from "../components/ShareResults";
import Footer from "../components/Footer";

export const Main = () => {
  const { isLoading } = useRound();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <RoundHeader />
      <StatDescription />
      <RoundStats />
      <Plot />
      <Download />
      <Leaderboard />
      <ShareResults />
      <Footer />
    </div>
  );
};
