import { RoundHeader } from "../components/main/RoundHeader";
import { StatDescription } from "../components/main/StatDescription";
import { RoundStats } from "../components/round/RoundStats";
import { useRound } from "../providers/RoundProvider";
import { Plot } from "../components/round/Plot";
import { Download } from "../components/round/Download";
import { Leaderboard } from "../components/round/Leaderboard";
import { ShareResults } from "../components/round/ShareResults";
import Footer from "../components/round/Footer";
import { RoundDonorDistributionPieChart } from "../components/round/RoundDOnorDistributionPieChart";
import { RoundDonationSizeDistribution } from "../components/round/RoundDonationSizeDistribution";
import { RoundTokenUsageChart } from "../components/round/RoundTokenUsageChart";
import { RoundDonationAmountByHourChart } from "@/components/round/RoundDonationAMountByHourChart";
import { RoundCumulativeDonationAmountChart } from "@/components/round/RoundCumulativeDonationAmountChart";
export const RoundDetails = () => {
  const { isLoading } = useRound();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1000px] mx-auto">
      <RoundHeader />
      <StatDescription />
      <RoundStats />
      <RoundDonorDistributionPieChart />
      <Plot />
      <Download />
      <RoundDonationSizeDistribution />
      <RoundTokenUsageChart />
      <RoundDonationAmountByHourChart />
      <RoundCumulativeDonationAmountChart />
      <Leaderboard />
      <ShareResults />
      <Footer />
    </div>
  );
};
