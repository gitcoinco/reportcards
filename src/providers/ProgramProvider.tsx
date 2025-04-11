import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql';
import { GET_PROGRAM_WITH_ROUND_ID } from '../queries/round';
import { ProgramRound, Program, ProgramContextType, GraphQLResponse } from '../types';

const ProgramContext = createContext<ProgramContextType>({
  programs: [],
  isLoading: false,
  error: null,
  activeProgramId: null,
  activeProgram: null,
  setActiveProgramId: () => {}
});

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

  return (
    <ProgramContext.Provider value={{ 
      programs, 
      isLoading: roundsLoading,
      error: roundsError,
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
