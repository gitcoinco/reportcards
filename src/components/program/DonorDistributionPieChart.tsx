import { PieChart } from "@gitcoin/ui";
import { useProgram } from "../../providers/ProgramProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { DonationNode } from "../../types/round";

const wrapReturn = (content: React.ReactNode) => (
  <div className="w-full h-full py-20">
    <div className="max-w-[1000px] mx-auto px-4 flex justify-center">
      {content}
    </div>
  </div>
);

export const DonorDistributionPieChart = () => {
  const { donationsData, isDonationsLoading } = useProgram();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!donationsData || donationsData.length === 0) {
    return wrapReturn(<div>No donation data available</div>);
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