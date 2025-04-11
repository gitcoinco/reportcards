import { PoolSummary } from "@gitcoin/ui/pool";
import { useRound } from "../../providers/RoundProvider";
import { useParams } from "react-router-dom";
import { ShareButton } from "./ShareButton";
export const RoundHeader = () => {
  const { chainId, roundId } = useParams();
  const { data } = useRound();

  if (!chainId || !roundId || !data) return null;

  const shareText = `🌐 ${data.matchAmount} DAI matching pool
    📈 $${data.totalAmountDonatedInUsd.toFixed(2)} funded so far
    🤝 ${data.totalDonationsCount} donations
    👀 Check out ${data.roundName}'s stats! 

    ${window.location.href}`;

  return (
    <>
      <PoolSummary
        applicationsEndTime={data.applicationEndTime}
        applicationsStartTime={data.applicationStartTime}
        chainId={Number(chainId)}
        donationsEndTime={data.donationEndTime}
        donationsStartTime={data.donationStartTime}
        name={data.roundName}
        poolId={roundId}
        programId={data.projectId}
        strategyName={data.strategyName}
        hideBreadcrumbs={true}
      />
      <div className="flex justify-between bg-[#F7F7F7] py-4 px-20 text-sm">
        <p>
          {data.roundDescription}
        </p>
      </div>
      <div className="flex justify-end mt-6 pr-6">
       <ShareButton />
      </div>
    </>
  );
}; 