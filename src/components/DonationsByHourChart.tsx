import { BarChart } from "@gitcoin/ui";
import { useProgram } from "../providers/ProgramProvider";
import { LoadingSpinner } from "./LoadingSpinner";

export const DonationsByHourChart = () => {
  const { donationsByHour, isDonationsLoading } = useProgram();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!donationsByHour || Object.keys(donationsByHour).length === 0) {
    return wrapReturn(<div>No donation data available</div>);
  }

  // Sort hours chronologically
  const sortedHours = Object.keys(donationsByHour).sort();

  const chartData = [{
    color: '#25BDCE',
    name: 'Donations',
    x: sortedHours,
    y: sortedHours.map(hour => donationsByHour[hour])
  }];

  return (
    wrapReturn(
      <BarChart
        data={chartData}
        description="Number of donations per hour"
        title="Donations by Hour"
        height={500}
        isDateAxis
        width={800}
        xAxisLabelInterval={5}
        xAxisTitle="Hour"
        yAxisLabelInterval={5}
        yAxisTitle="Number of Donations"
      />
    )
  );
};

const wrapReturn = (component: React.ReactNode) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-20">
      {component}
    </div>
  );
}; 