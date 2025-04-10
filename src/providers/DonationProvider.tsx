import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql';
import { GET_PROGRAM_DONATIONS } from '../queries/round';
import { DonationNode } from '../types/round';

interface DonationsResponse {
  donations: DonationNode[];
}

interface TokenUsage {
  [tokenAddress: string]: number;
}

interface DonationsByHour {
  [hour: string]: {
    count: number;
    amount: number;
  };
}

interface DonationContextType {
  donationsData: DonationNode[];
  isDonationsLoading: boolean;
  tokenUsage: TokenUsage;
  donationsByHour: DonationsByHour;
}

const DonationContext = createContext<DonationContextType>({
  donationsData: [],
  isDonationsLoading: false,
  tokenUsage: {},
  donationsByHour: {},
});

const fetchDonations = async (chainId: number, roundIds: string[]) => {
  console.log("Starting fetchDonations for chainId:", chainId, "roundIds:", roundIds);
  const CHUNK_SIZE = 100;
  let offset = 0;
  const allDonations: DonationNode[] = [];

  try {
    while (true) {
      console.log("Fetching chunk with offset:", offset);
      const response: DonationsResponse = await graphqlClient.request<DonationsResponse>(GET_PROGRAM_DONATIONS, {
        chainId,
        roundIds,
        limit: CHUNK_SIZE,
        offset
      });

      console.log("Received response with donations:", response.donations.length);

      if (response.donations.length === 0) {
        console.log("No more donations to fetch");
        break;
      }

      allDonations.push(...response.donations);
      offset += CHUNK_SIZE;
    }

    console.log("Completed fetchDonations. Total donations:", allDonations.length);
    return allDonations;
  } catch (error) {
    console.error("Error in fetchDonations:", error);
    return [];
  }
};

const getTokenUsage = (donations: DonationNode[]): TokenUsage => {
  console.log("Calculating token usage for", donations.length, "donations");
  return donations.reduce((acc, donation) => {
    const { tokenAddress } = donation;
    if (!acc[tokenAddress]) {
      acc[tokenAddress] = 0;
    }
    acc[tokenAddress]++;
    return acc;
  }, {} as TokenUsage);
};

const getDonationsByHour = (donations: DonationNode[]): DonationsByHour => {
  console.log("Calculating donations by hour for", donations.length, "donations");
  return donations.reduce((acc, donation) => {
    const date = new Date(donation.timestamp);
    const hour = date.toISOString().slice(0, 13); // Format: YYYY-MM-DDTHH
    if (!acc[hour]) {
      acc[hour] = { count: 0, amount: 0 };
    }
    acc[hour].count++;
    acc[hour].amount += donation.amountInUsd;
    return acc;
  }, {} as DonationsByHour);
};

export const DonationProvider = ({ 
  children,
  activeProgramId,
  roundsData
}: { 
  children: React.ReactNode;
  activeProgramId: string | null;
  roundsData: any[] | null;
}) => {
  console.log("DonationProvider render with activeProgramId:", activeProgramId, "roundsData:", roundsData);

  const { data: donationsData, isLoading: donationsLoading } = useQuery({
    queryKey: ['programDonations', activeProgramId],
    queryFn: async () => {
      console.log("useQuery queryFn called with activeProgramId:", activeProgramId);
      
      if (!roundsData || !activeProgramId) {
        console.log("No roundsData or activeProgramId, returning empty array");
        return [];
      }
      
      const activeProgramRounds = roundsData.filter(round => round.projectId === activeProgramId);
      console.log("Found activeProgramRounds:", activeProgramRounds.length);
      
      if (activeProgramRounds.length === 0) {
        console.log("No active program rounds found");
        return [];
      }

      const roundIds = activeProgramRounds.map(round => round.id);
      const chainIds = [...new Set(activeProgramRounds.map(round => round.chainId))];
      
      console.log("Fetching donations for roundIds:", roundIds, "chainIds:", chainIds);
      
      const allDonations = await Promise.all(
        chainIds.map(chainId => fetchDonations(chainId, roundIds))
      );
      
      const flattenedDonations = allDonations.flat();
      console.log("Total flattened donations:", flattenedDonations.length);
      return flattenedDonations;
    },
    enabled: !!roundsData && !!activeProgramId,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  console.log("DonationProvider state - donationsData:", donationsData?.length, "isLoading:", donationsLoading);

  const tokenUsage = useMemo(() => {
    console.log("Recalculating tokenUsage");
    return donationsData ? getTokenUsage(donationsData) : {};
  }, [donationsData]);

  const donationsByHour = useMemo(() => {
    console.log("Recalculating donationsByHour");
    return donationsData ? getDonationsByHour(donationsData) : {};
  }, [donationsData]);

  return (
    <DonationContext.Provider value={{ 
      donationsData: donationsData || [],
      isDonationsLoading: donationsLoading,
      tokenUsage,
      donationsByHour
    }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
}; 