import { StatCardGroup } from "@gitcoin/ui";
import { useProgram } from "../providers/ProgramProvider";
import { useProgramAggregate } from "../hooks/useProgramAggregate";
import { useParams } from "react-router-dom";
import { getChainById } from "@gitcoin/gitcoin-chain-data";


const getTokenDecimals = (tokenAddress: string, chainId: number): number => {
  const chain = getChainById(chainId);
  const token = chain.tokens.find((t) => t.address === tokenAddress);
  return token?.decimals || 18;
};

const formatTokenAmount = (amount: number, decimals: number): string => {
  return (amount / Math.pow(10, decimals)).toFixed(2);
};

export const ProgramStats = () => {
  const { programs, isLoading } = useProgram();
  const { programId } = useParams();

  if (isLoading || !programs.length) return null;

  // Find the current program by projectId
  const program = programs.find((p) => p.projectId === programId);
  if (!program) return null;

  const rounds = program.rounds;

  // Group rounds by chainId
  const roundsByChain = rounds.reduce((acc, round) => {
    if (!acc[round.chainId]) {
      acc[round.chainId] = [];
    }
    acc[round.chainId].push(round.id);
    return acc;
  }, {} as Record<number, string[]>);

  // Fetch aggregate data for each chain
  const aggregateQueries = Object.entries(roundsByChain).map(
    ([chainId, roundIds]) => useProgramAggregate(Number(chainId), roundIds)
  );

  // Combine results from all chains
  const stats = aggregateQueries.reduce(
    (acc, { data }) => {
      if (!data) return acc;

      return {
        uniqueDonors:
          acc.uniqueDonors + (data.donationsAggregate?.aggregate?.count || 0),
        totalMatchAmount:
          acc.totalMatchAmount +
          (data.roundsAggregate?.aggregate?.sum?.matchAmountInUsd || 0),
        totalFundedAmount:
          acc.totalFundedAmount +
          (data.roundsAggregate?.aggregate?.sum?.fundedAmountInUsd || 0),
        totalDonations:
          acc.totalDonations +
          (data.roundsAggregate?.aggregate?.sum?.totalAmountDonatedInUsd || 0),
        totalDonationsCount:
          acc.totalDonationsCount +
          (data.roundsAggregate?.aggregate?.sum?.totalDonationsCount || 0),
        approvedApplications:
          acc.approvedApplications +
          (data.approvedApplications?.aggregate?.count || 0),
        rejectedApplications:
          acc.rejectedApplications +
          (data.rejectedApplications?.aggregate?.count || 0),
        allApplications:
          acc.allApplications + (data.allApplications?.aggregate?.count || 0),
        matchTokenAmount:
          acc.matchTokenAmount +
          (data.roundsAggregate?.aggregate?.sum?.matchAmount || 0),
      };
    },
    {
      uniqueDonors: 0,
      totalMatchAmount: 0,
      totalFundedAmount: 0,
      totalDonations: 0,
      totalDonationsCount: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      allApplications: 0,
      matchTokenAmount: 0,
    }
  );

  const round = rounds[0];
  const matchTokenDecimals = getTokenDecimals(round.matchTokenAddress, round.chainId);

  return (
    <div className="mx-auto mt-12 px-4 flex flex-col gap-8 w-full">
      <StatCardGroup
        justify="center"
        className="w-full"
        size="lg"
        stats={[
          {
            label: "Total Match Amount",
            value: `${formatTokenAmount(
              stats.matchTokenAmount,
              matchTokenDecimals
            )} USDC`,
            subvalue: `($${stats.totalMatchAmount.toFixed(2)} USD)`,
          },
          {
            label: "Total Donations",
            value: `$${stats.totalDonations.toFixed(2)}`,
            subvalue: `(${stats.totalDonationsCount} donations)`,
          },
        ]}
      />
      <StatCardGroup
        justify="center"
        className="w-full"
        size="lg"
        stats={[
          {
            label: "Unique Donors",
            value: stats.uniqueDonors.toString(),
          },
          {
            label: "Applications",
            value: stats.allApplications.toString(),
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
            value: stats.approvedApplications.toString(),
          },
          {
            label: "Rejected Applications",
            value: stats.rejectedApplications.toString(),
          },
        ]}
      />
    </div>
  );
};
