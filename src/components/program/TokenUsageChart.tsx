import { PieChart } from "@gitcoin/ui";
import { useProgram } from "../../providers/ProgramProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { getChainById, TChain } from "@gitcoin/gitcoin-chain-data";

export const TokenUsageChart = () => {
  const { tokenUsage, isDonationsLoading, activeProgram } = useProgram();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!tokenUsage || Object.keys(tokenUsage).length === 0) {
    return wrapReturn(<div>No token usage data available</div>);
  }

  // Transform token usage data into format required by PieChart
  const chartData = Object.entries(tokenUsage).map(([tokenAddress, count]) => {
    // Get unique chain IDs from all rounds
    const chainIds = [...new Set(activeProgram?.rounds.map(round => round.chainId) || [])];
    
    // Try to find the token in each chain
    let tokenCode = tokenAddress;
    for (const chainId of chainIds) {
      const chain = getChainById(chainId);
      const token = chain.tokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
      if (token) {
        tokenCode = token.code;
        break;
      }
    }

    return {
      name: tokenCode,
      value: count
    };
  });

  // Calculate total number of donations
  const totalDonations = Object.values(tokenUsage).reduce((sum, count) => sum + count, 0);

  return (
    wrapReturn(
      <PieChart
        data={chartData}
        description="Number of donations using each token"
        title="Token Usage Distribution"
        total={`${totalDonations}`}
        width={800}
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