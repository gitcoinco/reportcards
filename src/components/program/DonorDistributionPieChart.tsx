import { useDonation } from "../../providers/DonationProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { PieChart } from "@gitcoin/ui";
import { DonationNode } from "../../types";

const wrapReturn = (component: React.ReactNode) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-20">
      {component}
    </div>
  );
};

export const DonorDistributionPieChart = () => {
  const { isDonationsLoading } = useDonation();
  const { donationsData } = useDonation();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!donationsData || donationsData.length === 0) {
    return wrapReturn(<div>No donations available</div>);
  }

  // Count donations per donor
  const donorCounts = donationsData.reduce((acc: Record<string, number>, donation: DonationNode) => {
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
      description="Distribution of unique vs repeat donors"
      title="Donor Distribution"
      total={`${uniqueDonors + repeatDonors}`}
      width={800}
    />
  );
}; 