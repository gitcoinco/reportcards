import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql";
import { GET_ROUND } from "../queries/round";
import { Round, RoundData, LeaderboardEntry, RoundContextType } from "../types";
import { getChainById } from "@gitcoin/gitcoin-chain-data";
import { formatUnits, Hex } from "viem";
import { getTokenPrice } from "../utils";

const RoundContext = createContext<RoundContextType>({
  data: null,
  isLoading: false,
  error: null,
});

export const RoundProvider = ({
  children,
  chainId,
  roundId,
}: {
  children: React.ReactNode;
  chainId: number;
  roundId: string;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["round", chainId, roundId],
    queryFn: async () => {
      const response = await graphqlClient.request<{ rounds: Round[] }>(
        GET_ROUND,
        {
          chainId,
          id: roundId,
        }
      );
      return response.rounds[0];
    },
  });

  const [processedData, setProcessedData] = useState<RoundData | null>(null);

  useEffect(() => {
    const processData = async () => {
      if (!data) {
        setProcessedData(null);
        return;
      }

      const chain = getChainById(chainId);
      const token = chain?.tokens.find(
        (token) =>
          token.address.toLowerCase() === data.matchTokenAddress.toLowerCase()
      );
      const tokenSymbol = token?.code;
      const tokenDecimals = token?.decimals;
      if (!tokenSymbol || !tokenDecimals) {
        console.error("Token symbol or decimals not found");
        setProcessedData(null);
        return;
      }

      const tokenPrice = await getTokenPrice(tokenSymbol, {
        chainId,
        address: data.matchTokenAddress as Hex,
      });
      const matchAmount = formatUnits(
        BigInt(data.matchAmount),
        tokenDecimals || 18
      );
      const matchAmountInUsd = tokenPrice
        ? tokenPrice * Number(matchAmount)
        : data.matchAmountInUsd;
      const roundMetadata =
        typeof data.roundMetadata === "string"
          ? JSON.parse(data.roundMetadata)
          : data.roundMetadata;

      // Process applications for plot data and leaderboard
      const applications = data.applications.map((app) => ({
        ...app,
        metadata:
          typeof app.metadata === "string"
            ? JSON.parse(app.metadata)
            : app.metadata,
      }));

      const plotData = {
        labels: applications.map(
          (app) => app.metadata.application.project.title
        ),
        values: applications.map((app) => app.totalAmountDonatedInUsd),
      };

      const leaderboard = applications
        .map((app) => {
          const matchingDistribution = data.matchingDistribution?.find(
            (dist) =>
              dist.projectId.toLowerCase() === app.projectId.toLowerCase()
          );
          let matchedUsd = 0;
          if (matchingDistribution && tokenDecimals) {

            const matchedAmount = formatUnits(
              BigInt(matchingDistribution.matchAmountInToken),
              tokenDecimals
            );
            matchedUsd = tokenPrice ? tokenPrice * Number(matchedAmount) : 0;
          }

          const totalAmount = app.totalAmountDonatedInUsd + matchedUsd;

          return {
            project: {
              name: app.metadata.application.project.title,
              description: app.metadata.application.project.description,
              logoImg: `${import.meta.env.VITE_IPFS_URL}${
                app.metadata.application.project.logoImg
              }`,
              projectGithub: app.metadata.application.project.projectGithub,
              projectTwitter: app.metadata.application.project.projectTwitter,
              website: app.metadata.application.project.website,
            },
            metrics: {
              uniqueDonorsCount: app.uniqueDonorsCount,
              totalAmountDonatedInUsd: Number(app.totalAmountDonatedInUsd.toFixed(2)),
              matchedUsd: Number(matchedUsd.toFixed(2)),
              totalAmount: Number(totalAmount.toFixed(2)),
            },
          };
        })
        .sort(
          (a, b) =>
            Number(b.metrics.totalAmount) - Number(a.metrics.totalAmount)
        )
        .reduce((acc, entry, index) => {
          acc[index + 1] = entry;
          return acc;
        }, {} as Record<number, LeaderboardEntry>);

      const matchingCap =
        roundMetadata.quadraticFundingConfig?.matchingCapAmount || 0;
      const matchingCapInUsd =
        matchingCap && matchingCap !== 0
          ? (matchingCap * Number(matchAmount)) / 100
          : 0;

      setProcessedData({
        roundName: roundMetadata.name,
        roundDescription: roundMetadata.eligibility.description,
        applicationStartTime: data.applicationsStartTime,
        applicationEndTime: data.applicationsEndTime,
        donationStartTime: data.donationsStartTime,
        donationEndTime: data.donationsEndTime,
        id: data.id,
        chainId: chainId,
        matchAmount,
        matchAmountInUsd: matchAmountInUsd,
        matchingCap: matchingCap,
        matchingCapInUsd: matchingCapInUsd,
        totalDonationsCount: data.totalDonationsCount,
        totalAmountDonatedInUsd: data.totalAmountDonatedInUsd,
        uniqueDonorsCount: data.uniqueDonorsCount,
        projectId: data.projectId,
        strategyName: data.strategyName,
        applicationCount: applications.length,
        tokenSymbol,
        tokenDecimals,
        plotData,
        leaderboard,
        matchingDistribution: data.matchingDistribution,
      });
    };

    processData();
  }, [data, chainId]);

  return (
    <RoundContext.Provider value={{ data: processedData, isLoading, error }}>
      {children}
    </RoundContext.Provider>
  );
};

export const useRound = () => {
  const context = useContext(RoundContext);
  if (context === undefined) {
    throw new Error("useRound must be used within a RoundProvider");
  }
  return context;
};
