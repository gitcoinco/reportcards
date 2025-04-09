import { BarChart } from "@gitcoin/ui";
import { useProgram } from "../providers/ProgramProvider";
import { LoadingSpinner } from "./LoadingSpinner";

const formatHour = (hourString: string) => {
  const [datePart, timePart] = hourString.split('T');
  const [year, month, day] = datePart.split('-');
  const hour = timePart.split(':')[0];
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[parseInt(month) - 1];
  
  return `${day} ${monthName} ${year} ${hour}:00`;
};

export const DonationAmountByHourChart = () => {
  const { donationsByHour, isDonationsLoading } = useProgram();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!donationsByHour || Object.keys(donationsByHour).length === 0) {
    return wrapReturn(<div>No donation data available</div>);
  }

  const sortedHours = Object.keys(donationsByHour).sort();

  const chartData = [{
    color: '#2F855A',
    name: 'Donation Amount',
    x: sortedHours.map(formatHour),
    y: sortedHours.map(hour => donationsByHour[hour].amount)
  }];

  return (
    wrapReturn(
      <BarChart
        data={chartData}
        description="Total donation amount per hour"
        title="Donation Amount by Hour"
        height={500}
        isDateAxis={false}
        width={800}
        xAxisLabelInterval={5}
        xAxisTitle="Date & Time"
        yAxisLabelInterval={1000}
        yAxisTitle="Amount (USD)"
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