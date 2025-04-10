import { useProgram } from "../../providers/ProgramProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { DonationNode } from "../../types/round";
import { PieChart, BarChart } from "@gitcoin/ui";
import { TabView } from "../main/TabView";
const wrapReturn = (content: React.ReactNode, showHeading: boolean = true) => (
  <div className="w-full h-full py-20">
    <div className="max-w-[1000px] mx-auto px-4 flex flex-col items-center">
      {showHeading && <h2 className="text-2xl font-bold mb-4">Donation Size Distribution</h2>}
      {content}
    </div>
  </div>
);

const DonationSizeDistributionContent = () => {
  const { donationsData } = useProgram();

  // Define donation size ranges with more granularity for smaller amounts
  const ranges = [
    { min: 0, max: 1, label: "$0-1" },
    { min: 1, max: 2, label: "$1-2" },
    { min: 2, max: 4, label: "$2-4" },
    { min: 4, max: 6, label: "$4-6" },
    { min: 6, max: 10, label: "$6-10" },
    { min: 10, max: 20, label: "$10-20" },
    { min: 20, max: 50, label: "$20-50" },
    { min: 50, max: 100, label: "$50-100" },
    { min: 100, max: 250, label: "$100-250" },
    { min: 250, max: Infinity, label: "$250+" }
  ];

  // Count donations in each range
  const rangeCounts = ranges.map(range => ({
    label: range.label,
    count: donationsData.filter((donation: DonationNode) => {
      const amount = donation.amountInUsd;
      return amount >= range.min && amount < range.max;
    }).length
  }));

  // Calculate total number of donations
  const totalDonations = rangeCounts.reduce((sum, range) => sum + range.count, 0);

  // Prepare data for PieChart
  const pieData = ranges.map(range => ({
    name: range.label,
    value: donationsData.filter((donation: DonationNode) => {
      const amount = donation.amountInUsd;
      return amount >= range.min && amount < range.max;
    }).length
  }));

  // Prepare data for BarChart
  const barData = [{
    color: '#4299E1', // Blue
    name: 'Number of Donations',
    x: rangeCounts.map(r => r.label),
    y: rangeCounts.map(r => r.count)
  }];

  const tabs = [
    {
      label: "Pie Chart",
      content: (
        <PieChart
          data={pieData}
          description="Distribution of donations by size range"
          // title="Donation Size Distribution"
          total={`${totalDonations}`}
          width={800}
        />
      )
    },
    {
      label: "Bar Chart",
      content: (
        <BarChart
          data={barData}
          description="Distribution of donations by size range"
          // title="Donation Size Distribution"
          height={500}
          isDateAxis={false}
          width={800}
          xAxisLabelInterval={1}
          xAxisTitle="Donation Size Range"
          yAxisTitle="Number of Donations"
        />
      )
    }
  ];

  return <TabView tabs={tabs} />;
};

export const DonationSizeDistribution = () => {
  const { donationsData, isDonationsLoading, activeProgram } = useProgram();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />, false);
  }

  if (!donationsData || donationsData.length === 0) {
    return wrapReturn(<div>No donation data available</div>);
  }

  return wrapReturn(<DonationSizeDistributionContent />);
}; 