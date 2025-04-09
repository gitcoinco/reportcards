import { BarChart } from "@gitcoin/ui";
import { useProgram } from "../providers/ProgramProvider";
import { LoadingSpinner } from "./LoadingSpinner";

const formatHour = (hourString: string) => {
  // The hourString is in format "YYYY-MM-DDTHH:00:00.000Z"
  const [datePart, timePart] = hourString.split('T');
  const [year, month, day] = datePart.split('-');
  const hour = timePart.split(':')[0];
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[parseInt(month) - 1];
  
  return `${day} ${monthName} ${year} ${hour}:00`;
};

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
    x: sortedHours.map(formatHour),
    y: sortedHours.map(hour => donationsByHour[hour])
  }];

  return (
    wrapReturn(
      <BarChart
        data={chartData}
        description="Number of donations per hour"
        title="Donations by Hour"
        height={500}
        isDateAxis={false}
        width={800}
        xAxisLabelInterval={5}
        xAxisTitle="Date & Time"
        yAxisLabelInterval={5}
        yAxisTitle="Number of Donations"
      />
    )
  );
};

const wrapReturn = (component: React.ReactNode) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {component}
    </div>
  );
}; 