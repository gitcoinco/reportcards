import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql';
import { GET_PROGRAM_WITH_ROUND_ID } from '../queries/round';
import { ProgramRound, Program, ProgramContextType } from '../types/round';

interface GraphQLResponse {
  rounds: ProgramRound[];
}

const ProgramContext = createContext<ProgramContextType>({
  programs: [],
  isLoading: false,
  error: null,
});

export const ProgramProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const response = await graphqlClient.request<GraphQLResponse>(GET_PROGRAM_WITH_ROUND_ID);
      return response.rounds;
    },
  });

  const programs = data?.reduce((acc: Program[], round: ProgramRound) => {
    // First, find or create the program by project name
    let program = acc.find(p => p.projectName === round.project.name);
    
    if (!program) {
      program = {
        projectName: round.project.name,
        projectId: round.projectId,
        rounds: []
      };
      acc.push(program);
    }
    
    // Add the round to the program's rounds if it doesn't already exist
    if (!program.rounds.some(r => r.id === round.id && r.chainId === round.chainId)) {
      program.rounds.push({
        id: round.id,
        chainId: round.chainId,
        roundMetadata: round.roundMetadata,
        projectId: round.projectId,
        project: round.project
      });
    }
    
    return acc;
  }, []) || [];

  // Sort programs by project name
//   programs.sort((a, b) => a.projectName.localeCompare(b.projectName));

  // Sort rounds within each program by chainId
  programs.forEach(program => {
    program.rounds.sort((a, b) => a.chainId - b.chainId);
  });

  return (
    <ProgramContext.Provider value={{ programs, isLoading, error }}>
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
