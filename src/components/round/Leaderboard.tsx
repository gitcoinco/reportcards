import { useRound } from "../../providers/RoundProvider";
import { Leaderboard as LeaderboardComponent } from "@gitcoin/ui";

export const Leaderboard = () => {
  const { data } = useRound();

  if (!data?.leaderboard) return null;

  const metrics = {
    uniqueDonorsCount: {
      description: "Number of unique donors",
      name: "Donors",
    },
    totalAmountDonatedInUsd: {
      description: "Total amount donated in USD",
      name: "Donations",
    },
    matchedUsd: {
      description: "Amount matched in USD",
      name: "Matched USD",
    },
    totalAmount: {
      description: "Total amount including matching",
      name: "Total USD",
    },
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Leaderboard</h2>
      </div>
      <div className="space-y-6">
        <LeaderboardComponent projects={data.leaderboard} metrics={metrics} size="slim" />
      </div>
    </div>
  );
};
