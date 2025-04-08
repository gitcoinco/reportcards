import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql';
import { GET_PROGRAM_AGGREGATE_DATA } from '../queries/round';

type AggregateData = {
  donationsAggregate?: { aggregate?: { count?: number } };
  roundsAggregate?: { aggregate?: { sum?: {
    matchAmountInUsd?: number;
    fundedAmountInUsd?: number;
    totalAmountDonatedInUsd?: number;
    totalDonationsCount?: number;
    matchAmount?: number;
  } } };
  approvedApplications?: { aggregate?: { count?: number } };
  rejectedApplications?: { aggregate?: { count?: number } };
  allApplications?: { aggregate?: { count?: number } };
};

export const useProgramAggregate = (chainId: number, roundIds: string[]) => {
  return useQuery<AggregateData>({
    queryKey: ['programAggregate', chainId, roundIds],
    queryFn: async () => {
      if (!roundIds.length) {
        return {
          donationsAggregate: { aggregate: { count: 0 } },
          roundsAggregate: { aggregate: { sum: {
            matchAmountInUsd: 0,
            fundedAmountInUsd: 0,
            totalAmountDonatedInUsd: 0,
            totalDonationsCount: 0,
            matchAmount: 0
          } } },
          approvedApplications: { aggregate: { count: 0 } },
          rejectedApplications: { aggregate: { count: 0 } },
          allApplications: { aggregate: { count: 0 } }
        };
      }
      return graphqlClient.request<AggregateData>(GET_PROGRAM_AGGREGATE_DATA, {
        chainId,
        roundIds
      });
    },
    enabled: roundIds.length > 0
  });
}; 