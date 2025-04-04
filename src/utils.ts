export type PriceSource = {
    chainId: number;
    address: `0x${string}`; 
  };
  

export async function getTokenPrice(
    tokenId: string,    
    priceSource?: PriceSource
  ) {
    if (
      tokenId === "" &&
      priceSource?.chainId !== undefined &&
      priceSource?.address !== undefined
    ) {
      return getTokenPriceFromCoingecko(priceSource);
    }
    const tokenPriceEndpoint = `https://api.redstone.finance/prices?symbol=${tokenId}&provider=redstone&limit=1`;
    const resp = await fetch(tokenPriceEndpoint);
    const data = await resp.json();
    return data[0].value;
  }
  
  async function getTokenPriceFromCoingecko(priceSource: PriceSource) {
    const url = `https://pro-api.coingecko.com/api/v3/simple/token_price/${getChainById(priceSource.chainId)?.coingeckoId}?contract_addresses=${priceSource.address}&vs_currencies=usd`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": import.meta.env.VITE_COINGECKO_API_KEY || "",
      },
    };
    const resp = await fetch(url, options);
    const data = await resp.json();
    return data[priceSource.address.toLowerCase()].usd;
  }

export const exportLeaderboardToCSV = (leaderboard: Record<string, any>, roundName: string) => {
  // Create CSV header
  const headers = [
    'Rank',
    'Project Name',
    'Unique Donors',
    'Total Donated (USD)',
    'Matched (USD)',
    'Total (USD)'
  ];

  // Create CSV rows
  const rows = Object.entries(leaderboard).map(([rank, project]) => [
    rank,
    project.project.name,
    project.metrics.uniqueDonorsCount,
    project.metrics.totalAmountDonatedInUsd,
    project.metrics.matchedUsd,
    project.metrics.totalAmount
  ]);

  // Combine header and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${roundName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_leaderboard.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};