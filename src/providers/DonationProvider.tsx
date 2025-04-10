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
  console.log("Fetching donations for chainId", chainId, "and roundIds", roundIds);
  const CHUNK_SIZE = 100;
  let offset = 0;
  const allDonations: DonationNode[] = [];

  try {
    while (true) {
      const response: DonationsResponse = await graphqlClient.request<DonationsResponse>(GET_PROGRAM_DONATIONS, {
        chainId,
        roundIds,
        limit: CHUNK_SIZE,
        offset
      });

      if (response.donations.length === 0) {
        break;
      }

      allDonations.push(...response.donations);
      offset += CHUNK_SIZE;
    }

    return allDonations;
  } catch (error) {
    console.error(`Error fetching donations for rounds ${roundIds.join(',')}:`, error);
    return [];
  }
};

const getTokenUsage = (donations: DonationNode[]): TokenUsage => {
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
  const { data: donationsData, isLoading: donationsLoading } = useQuery({
    queryKey: ['programDonations', activeProgramId],
    queryFn: async () => {
      if (!roundsData || !activeProgramId) return [];
      
      const activeProgramRounds = roundsData.filter(round => round.projectId === activeProgramId);
      if (activeProgramRounds.length === 0) return [];

      const roundIds = activeProgramRounds.map(round => round.id);
      const chainIds = [...new Set(activeProgramRounds.map(round => round.chainId))];
      
      const allDonations = await Promise.all(
        chainIds.map(chainId => fetchDonations(chainId, roundIds))
      );
      
      return allDonations.flat();
    },
    enabled: !!roundsData && !!activeProgramId,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const tokenUsage = useMemo(() => 
    donationsData ? getTokenUsage(donationsData) : {}, 
    [donationsData]
  );

  const donationsByHour = useMemo(() => 
    donationsData ? getDonationsByHour(donationsData) : {}, 
    [donationsData]
  );

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