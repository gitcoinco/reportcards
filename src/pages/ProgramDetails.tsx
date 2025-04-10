import { useEffect } from "react";
import { ProgramStats } from "../components/program/ProgramStats";
import { TokenUsageChart } from "../components/program/TokenUsageChart";
import { DonationsByHourChart } from "../components/program/DonationsByHourChart";
import { DonationAmountByHourChart } from "../components/program/DonationAmountByHourChart";
import { CumulativeDonationAmountChart } from "../components/program/CumulativeDonationAmountChart";
import { DonorDistributionPieChart } from "../components/program/DonorDistributionPieChart";
import { ProjectDonationsPlot } from "../components/program/ProjectDonationsPlot";
import { DonationSizeDistribution } from "../components/program/DonationSizeDistribution";
import { useProgram } from "../providers/ProgramProvider";
import { DonationProvider } from "../providers/DonationProvider";
import { useParams } from "react-router-dom";

export const ProgramDetails = () => {
  const { programId } = useParams();
  const { activeProgram, setActiveProgramId, programs } = useProgram();

  useEffect(() => {
    if (programId) {
      setActiveProgramId(programId);
    }
  }, [programId, setActiveProgramId]);

  if (!activeProgram) {
    return null;
  }

  // Get all rounds for the active program
  const roundsData = activeProgram.rounds;

  return (
    <DonationProvider activeProgramId={activeProgram.projectId} roundsData={roundsData}>
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
    </DonationProvider>
  );
};
