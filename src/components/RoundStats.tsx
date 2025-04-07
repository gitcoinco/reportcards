import { StatCardGroup } from "@gitcoin/ui";
import { useParams } from "react-router-dom";
import { useRound } from "../providers/RoundProvider";
import { useProgramAggregate } from "../hooks/useProgramAggregate";

export const RoundStats = () => {
  const { chainId, roundId } = useParams();
  const numericChainId = chainId ? parseInt(chainId, 10) : 0;
  const { data: roundData } = useRound();
  const { data: aggregateData } = useProgramAggregate(numericChainId, [roundId || ""]);

  if (!roundData || !aggregateData) return null;

  return (
    <div className="mx-auto mt-12 px-4 flex flex-col gap-8 w-full">
      <StatCardGroup
        justify="center"
        className="w-full"
        size="lg"
        stats={[
          {
            label: "Matching Pool",
            value: `${roundData.matchAmount} ${roundData.tokenSymbol}`,
            subvalue: `($${roundData.matchAmountInUsd.toFixed(2)})`,
          },
          {
            label: "Total USD Crowdfunded",
            value: `$${roundData.totalAmountDonatedInUsd.toFixed(2)}`,
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
            value: `${roundData.matchingCap}%`,
            subvalue: `($${roundData.matchingCapInUsd.toFixed(2)} ${roundData.tokenSymbol})`,
          },
          {
            label: "Total Projects",
            value: roundData.applicationCount.toString(),
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
            value: roundData.totalDonationsCount.toString(),
          },
          {
            label: "Total Donors",
            value: roundData.uniqueDonorsCount.toString(),
          },
        ]}
      />
      <StatCardGroup
        justify="center"
        className="w-full"
        size="lg"
        stats={[
          {
            label: "Approved Applications",
            value: (aggregateData.approvedApplications?.aggregate?.count || 0).toString(),
          },
          {
            label: "Rejected Applications",
            value: (aggregateData.rejectedApplications?.aggregate?.count || 0).toString(),
          },
        ]}
      />
    </div>
  );
}; 