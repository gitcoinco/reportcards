import { useEffect } from "react";
import { ProgramStats } from "../components/ProgramStats";
import { TokenUsageChart } from "../components/TokenUsageChart";
import { DonationsByHourChart } from "../components/DonationsByHourChart";
import { DonationAmountByHourChart } from "../components/DonationAmountByHourChart";
import { CumulativeDonationAmountChart } from "../components/CumulativeDonationAmountChart";
import { DonorDistributionPieChart } from "../components/DonorDistributionPieChart";
import { ProjectDonationsPlot } from "../components/ProjectDonationsPlot";
import { DonationSizeDistribution } from "../components/DonationSizeDistribution";
import { useProgram } from "../providers/ProgramProvider";
import { useParams } from "react-router-dom";

export const ProgramDetails = () => {
  const { programId } = useParams();
  const { activeProgram, setActiveProgramId } = useProgram();
  
  useEffect(() => {
    if (programId) {
      setActiveProgramId(programId);
    }
  }, [programId, setActiveProgramId]);

  if (!activeProgram) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{activeProgram.projectName} Stats</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProgramStats />
        <DonorDistributionPieChart />
        <ProjectDonationsPlot />
        <DonationSizeDistribution />
        <TokenUsageChart />
        <DonationsByHourChart />
        <DonationAmountByHourChart />
        <CumulativeDonationAmountChart />
      </div>
    </div>
  );
};
