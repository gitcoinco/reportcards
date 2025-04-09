import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql';
import { GET_PROGRAM_WITH_ROUND_ID, GET_PROGRAM_DONATIONS } from '../queries/round';
import { ProgramRound, Program, ProgramContextType } from '../types/round';

interface GraphQLResponse {
  rounds: ProgramRound[];
}

interface DonationNode {
  amount: string;
  amountInUsd: number;
  applicationId: string;
  timestamp: string;
  chainId: number;
  id: string;
  donorAddress: string;
  recipientAddress: string;
  projectId: string;
  roundId: string;
  tokenAddress: string;
  application: {
    project: {
      id: string;
      name: string;
    };
  };
}

interface DonationsResponse {
  donations: DonationNode[];
}

interface TokenUsage {
  [tokenAddress: string]: number;
}

interface DonationsByHour {
  [hour: string]: number;
}

// Remove the local ProgramContextType interface and extend the imported one
type ExtendedProgramContextType = ProgramContextType & {
  donationsByHour: DonationsByHour;
};

const ProgramContext = createContext<ExtendedProgramContextType>({
  programs: [],
  isLoading: false,
  isDonationsLoading: false,
  error: null,
  tokenUsage: {},
  donationsByHour: {},
  activeProgramId: null,
  activeProgram: null,
  setActiveProgramId: () => {}
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
      acc[hour] = 0;
    }
    acc[hour]++;
    return acc;
  }, {} as DonationsByHour);
};

export const ProgramProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);

  const { data: roundsData, isLoading: roundsLoading, error: roundsError } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const response = await graphqlClient.request<GraphQLResponse>(GET_PROGRAM_WITH_ROUND_ID);
      return response.rounds;
    },
  });

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

  const programs = useMemo(() => {
    if (!roundsData) return [];
    
    const programs = roundsData.reduce((acc: Program[], round: ProgramRound) => {
      let program = acc.find(p => p.projectName === round.project.name);
      
      if (!program) {
        program = {
          projectName: round.project.name,
          projectId: round.projectId,
          rounds: []
        };
        acc.push(program);
      }
      
      if (!program.rounds.some(r => r.id === round.id && r.chainId === round.chainId)) {
        program.rounds.push({
          id: round.id,
          chainId: round.chainId,
          roundMetadata: round.roundMetadata,
          projectId: round.projectId,
          project: round.project,
          matchTokenAddress: round.matchTokenAddress
        });
      }
      
      return acc;
    }, []);

    programs.forEach(program => {
      program.rounds.sort((a, b) => a.chainId - b.chainId);
    });

    return programs;
  }, [roundsData]);

  // Update activeProgram when programId or programs change
  useEffect(() => {
    if (!activeProgramId || !programs.length) {
      setActiveProgram(null);
      return;
    }
    const program = programs.find(p => p.projectId === activeProgramId);
    setActiveProgram(program || null);
  }, [activeProgramId, programs]);

  const isLoading = roundsLoading || donationsLoading;
  const error = roundsError;

  return (
    <ProgramContext.Provider value={{ 
      programs, 
      isLoading: roundsLoading,
      isDonationsLoading: donationsLoading,
      error: roundsError,
      tokenUsage,
      donationsByHour,
      activeProgramId,
      activeProgram,
      setActiveProgramId
    }}>
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
};
