import { PieChart } from "@gitcoin/ui";
import { useDonation } from "../../providers/DonationProvider";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { getChainById, TToken } from "@gitcoin/gitcoin-chain-data";
import { DonationNode } from "../../types";

interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

const wrapReturn = (component: React.ReactNode) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-20">
      {component}
    </div>
  );
};

export const TokenUsageChart = () => {
  const { tokenUsage, isDonationsLoading, donationsData } = useDonation();

  if (isDonationsLoading) {
    return wrapReturn(<LoadingSpinner />);
  }

  if (!tokenUsage || Object.keys(tokenUsage).length === 0) {
    return wrapReturn(<div>No token usage data available</div>);
  }

  // Create a map of token addresses to their chain IDs
  const tokenChainMap = new Map<string, number>();
  donationsData.forEach((donation: DonationNode) => {
    tokenChainMap.set(donation.tokenAddress.toLowerCase(), donation.chainId);
  });

  const chartData = Object.entries(tokenUsage).map(([tokenAddress, count]) => {
    // Get the chain ID for this token
    const chainId = tokenChainMap.get(tokenAddress.toLowerCase());
    let tokenSymbol = tokenAddress;

    if (chainId) {
      const chain = getChainById(chainId);
      if (chain) {
        const token = chain.tokens.find((t: TToken) => 
          t.address.toLowerCase() === tokenAddress.toLowerCase()
        );
        if (token) {
          tokenSymbol = token.code;
        }
      }
    }
    
    return {
      name: tokenSymbol,
      value: count,
    };
  });

  return wrapReturn(
    <PieChart
      data={chartData}
      description="Distribution of tokens used for donations"
      title="Token Usage"
      total={`${Object.values(tokenUsage).reduce((a, b) => a + b, 0)}`}
      width={800}
    />
  );
};