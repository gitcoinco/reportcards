import { SquarePlot } from "@gitcoin/ui";
import { useDonation } from "../../providers/DonationProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { DonationNode } from "../../types/round";

const wrapReturn = (content: React.ReactNode, showHeading: boolean = true) => (
  <div className="w-full h-full py-20">
    <div className="max-w-[1000px] mx-auto px-4 flex flex-col items-center">
      {showHeading && <h2 className="text-2xl font-bold mb-4">Donations by Project</h2>}
      {content}
    </div>
  </div>
);

export const ProjectDonationsPlot = () => {
  const { donationsData, isDonationsLoading } = useDonation();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />, false);
  }

  if (!donationsData || donationsData.length === 0) {
    return wrapReturn(<div>No donation data available</div>);
  }

  // Count donations per project
  const projectCounts = donationsData.reduce((acc: Record<string, { count: number; name: string }>, donation: DonationNode) => {
    const projectId = donation.projectId;
    if (!acc[projectId]) {
      // Get project name from the donation's application data
      const projectName = donation.application?.project?.name || projectId;
      acc[projectId] = { count: 0, name: projectName };
    }
    acc[projectId].count++;
    return acc;
  }, {});

  // Sort projects by donation count and prepare data for SquarePlot
  const sortedProjects = Object.entries(projectCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([_, { name, count }]) => ({ name, count }));

  // Ensure we have data to display
  if (sortedProjects.length === 0) {
    return wrapReturn(<div>No project data available</div>);
  }

  return wrapReturn(
    <SquarePlot
      width={800}
      labels={sortedProjects.map(p => p.name)}
      values={sortedProjects.map(p => p.count)}
    />
  );
}; 