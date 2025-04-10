import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql';
import { GET_PROGRAM_DONATIONS } from '../queries/round';
import { DonationContextType, DonationNode, DonationsResponse } from '../types';
import { getDonationsByHour } from '@/utils/donations';
import { getTokenUsage } from '@/utils/donations';

const DonationContext = createContext<DonationContextType>({
  donationsData: [],
  isDonationsLoading: false,
  tokenUsage: {},   
  donationsByHour: {},
});

const fetchDonations = async (chainId: number, roundIds: string[]) => {
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
    console.error("Error in fetchDonations:", error);
    return [];
  }
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
      if (!roundsData || !activeProgramId) {
        return [];
      }
      
      const activeProgramRounds = roundsData.filter(round => round.projectId === activeProgramId);

      if (activeProgramRounds.length === 0) {
        return [];
      }

      const roundIds = activeProgramRounds.map(round => round.id);
      const chainIds = [...new Set(activeProgramRounds.map(round => round.chainId))];
            
      const allDonations = await Promise.all(
        chainIds.map(chainId => fetchDonations(chainId, roundIds))
      );
      
      const flattenedDonations = allDonations.flat();
      return flattenedDonations;
    },
    enabled: !!roundsData && !!activeProgramId,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const tokenUsage = useMemo(() => {
    return donationsData ? getTokenUsage(donationsData) : {};
  }, [donationsData]);

  const donationsByHour = useMemo(() => {
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