import { useDonation } from "../../providers/DonationProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { TabView } from "../main/TabView";
import { PieChart, BarChart } from "@gitcoin/ui";

const wrapReturn = (component: React.ReactNode) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-20">
      {component}
    </div>
  );
};

export const DonationSizeDistribution = () => {
  const { donationsData, isDonationsLoading } = useDonation();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!donationsData || donationsData.length === 0) {
    return wrapReturn(<div>No donations available</div>);
  }

  // Define donation size ranges
  const ranges = [
    { min: 0, max: 1, label: "$0-1" },
    { min: 1, max: 2, label: "$1-2" },
    { min: 2, max: 4, label: "$2-4" },
    { min: 4, max: 10, label: "$4-10" },
    { min: 10, max: 20, label: "$10-20" },
    { min: 20, max: 50, label: "$20-50" },
    { min: 50, max: 100, label: "$50-100" },
    { min: 100, max: 200, label: "$100-200" },
    { min: 200, max: Infinity, label: "$200+" },
  ];

  // Count donations in each range
  const rangeCounts = ranges.map(range => {
    const count = donationsData.filter(donation => 
      donation.amountInUsd >= range.min && donation.amountInUsd < range.max
    ).length;
    return { ...range, count };
  });

  // Prepare data for charts
  const pieData = rangeCounts.map(range => ({
    name: range.label,
    value: range.count
  }));

  const barData = [{
    color: '#4299E1',
    name: 'Donation Size Distribution',
    x: rangeCounts.map(range => range.label),
    y: rangeCounts.map(range => range.count)
  }];

  const tabs = [
    {
      label: "Pie Chart",
      content: (
        <PieChart
          data={pieData}
          description="Distribution of donation sizes"
          title="Donation Size Distribution"
          total={`${donationsData.length}`}
          width={800}
        />
      )
    },
    {
      label: "Bar Chart",
      content: (
        <BarChart
          data={barData}
          description="Distribution of donation sizes"
          title="Donation Size Distribution"
          height={500}
          isDateAxis={false}
          width={800}
          xAxisTitle="Donation Size Range"
          yAxisTitle="Number of Donations"
        />
      )
    }
  ];

  return wrapReturn(
    <TabView tabs={tabs} />
  );
}; 