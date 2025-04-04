import { StatCardGroup } from "@gitcoin/ui";
import { useRound } from "../providers/RoundProvider";

export const RoundStats = () => {
  const { data } = useRound();

  if (!data) return null;

  return (
    <div className="mx-auto mt-12 px-4 flex flex-col gap-8 w-full">
      <StatCardGroup
        justify="center"
        className="w-full"
        size="lg"
        stats={[
          {
            label: "Matching Pool",
            value: `${data.matchAmount} ${data.tokenSymbol}`,
            subvalue: `($${data.matchAmountInUsd.toFixed(2)})`,
          },
          {
            label: "Total USD Crowdfunded",
            value: `$${data.totalAmountDonatedInUsd.toFixed(2)}`,
          },
        ]}
      />
      <StatCardGroup
        justify="center"
        className="w-full"
        size="lg"
        stats={[
          {
            label: "Matching Cap",
            value: `${data.matchingCap}%`,
            subvalue: `(${data.matchingCapInUsd.toFixed(2)} ${data.tokenSymbol})`,
          },
          {
            label: "Total Projects",
            value: data.applicationCount.toString(),
          },
        ]}
      />
      <StatCardGroup
        justify="center"
        className="w-full"
        size="lg"
        stats={[
          {
            label: "Total Donations",
            value: data.totalDonationsCount.toString(),
          },
          {
            label: "Total Donors",
            value: data.uniqueDonorsCount.toString(),
          },
        ]}
      />
    </div>
  );
}; 