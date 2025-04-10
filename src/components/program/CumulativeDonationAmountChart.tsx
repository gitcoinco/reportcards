import { BarChart } from "@gitcoin/ui";
import { useProgram } from "../../providers/ProgramProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";

const formatHour = (hourString: string) => {
  const [datePart, timePart] = hourString.split('T');
  const [year, month, day] = datePart.split('-');
  const hour = timePart.split(':')[0];
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[parseInt(month) - 1];
  
  return `${day} ${monthName} ${year} ${hour}:00`;
};

export const CumulativeDonationAmountChart = () => {
  const { donationsByHour, isDonationsLoading } = useProgram();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!donationsByHour || Object.keys(donationsByHour).length === 0) {
    return wrapReturn(<div>No donation data available</div>);
  }

  const sortedHours = Object.keys(donationsByHour).sort();
  let cumulativeAmount = 0;

  const chartData = [{
    color: '#319795',
    name: 'Cumulative Donation Amount',
    x: sortedHours.map(formatHour),
    y: sortedHours.map(hour => {
      cumulativeAmount += donationsByHour[hour].amount;
      return cumulativeAmount;
    })
  }];

  return (
    wrapReturn(
      <BarChart
        data={chartData}
        description="Cumulative donation amount over time"
        title="Cumulative Donation Amount"
        height={500}
        isDateAxis={false}
        width={800}
        xAxisLabelInterval={5}
        xAxisTitle="Date & Time"
        yAxisLabelInterval={1000}
        yAxisTitle="Cumulative Amount (USD)"
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