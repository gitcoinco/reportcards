import { useDonation } from "../../providers/DonationProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { PieChart } from "@gitcoin/ui";
import { useParams } from "react-router-dom";

const wrapReturn = (component: React.ReactNode) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-20">
      {component}
    </div>
  );
};

export const RoundDonorDistributionPieChart = () => {
  const { roundId } = useParams();
  const { isDonationsLoading, roundDonations } = useDonation();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!roundId || !roundDonations[roundId]) {
    return wrapReturn(<div>No round data available</div>);
  }

  const roundData = roundDonations[roundId];
  const { donationsData } = roundData;

  if (!donationsData || donationsData.length === 0) {
    return wrapReturn(<div>No donations available for this round</div>);
  }

  // Count donations per donor
  const donorCounts = donationsData.reduce((acc: Record<string, number>, donation) => {
    const donorAddress = donation.donorAddress.toLowerCase();
    acc[donorAddress] = (acc[donorAddress] || 0) + 1;
    return acc;
  }, {});

  // Calculate unique vs repeat donors
  const uniqueDonors = Object.values(donorCounts).filter((count: number) => count === 1).length;
  const repeatDonors = Object.values(donorCounts).filter((count: number) => count > 1).length;

  return wrapReturn(
    <PieChart
      data={[
        { name: "Unique Donors", value: uniqueDonors },
        { name: "Repeat Donors", value: repeatDonors }
      ]}
      description="Distribution of unique vs repeat donors for this round"
      title="Round Donor Distribution"
      total={`${uniqueDonors + repeatDonors}`}
      width={800}
    />
  );
}; 