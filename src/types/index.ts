export interface Application {
  id: string;
  projectId: string;
  uniqueDonorsCount: number;
  totalAmountDonatedInUsd: number;
  metadata: {
    application: {
      project: {
        title: string;
      };
    };
  };
}

export interface RoundMetadata {
  name: string;
  eligibility: {
    description: string;
  };
}

export interface MatchingDistribution {
  projectId: string;
  matchAmountInToken: string;
  matchAmountInUsd: number;
}

export interface Round {
  id: string;
  matchAmount: string;
  matchAmountInUsd: number;
  totalDonationsCount: number;
  totalAmountDonatedInUsd: number;
  uniqueDonorsCount: number;
  roundMetadata: RoundMetadata;
  matchTokenAddress: string;
  applicationsStartTime: string;
  applicationsEndTime: string;
  donationsStartTime: string;
  donationsEndTime: string;
  projectId: string;
  strategyName: string;
  applications: Application[];
  matchingDistribution: MatchingDistribution[];
}

export type ProgramRound = {
  id: string;
  chainId: number;
  roundMetadata: {
    name: string;
    description: string;
  };
  projectId: string;
  project: {
    name: string;
  };
  matchTokenAddress: string;
};

export interface PlotData {
  labels: string[];
  values: number[];
}

export interface LeaderboardEntry {
  project: {
    name: string;
    description?: string;
    logoImg?: string;
    projectGithub?: string;
    projectTwitter?: string;
    website?: string;
  };
  metrics: {
    uniqueDonorsCount: number;
    totalAmountDonatedInUsd: number;
    matchedUsd: number;
    totalAmount: number;
  };
}

export interface RoundData {
  roundName: string;
  roundDescription: string;
  applicationStartTime: string;
  applicationEndTime: string;
  donationStartTime: string;
  donationEndTime: string;
  id: string;
  matchAmount: string;
  matchAmountInUsd: number;
  matchingCap: number;
  matchingCapInUsd: number;
  totalDonationsCount: number;
  totalAmountDonatedInUsd: number;
  uniqueDonorsCount: number;
  projectId: string;
  strategyName: string;
  applicationCount: number;
  tokenSymbol: string;
  tokenDecimals: number;
  plotData: PlotData;
  leaderboard: Record<number, LeaderboardEntry>;
  matchingDistribution: MatchingDistribution[];
}

export type Program = {
  projectName: string;
  projectId: string;
  rounds: ProgramRound[];
  stats?: {
    uniqueDonors: number;
    totalMatchAmount: number;
    totalFundedAmount: number;
    totalDonations: number;
    totalDonationsCount: number;
    approvedApplications: number;
    rejectedApplications: number;
    allApplications: number;
  };
};

export interface ProgramContextType {
  programs: Program[];
  isLoading: boolean;
  error: Error | null;
  activeProgramId: string | null;
  activeProgram: Program | null;
  setActiveProgramId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface RoundContextType {
    data: RoundData | null;
    isLoading: boolean;
    error: Error | null;
}


export interface DonationNode {
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

export interface GraphQLResponse {
    rounds: ProgramRound[];
  }

export interface DonationsResponse {
  donations: DonationNode[];
}

export interface TokenUsage {
  [tokenAddress: string]: number;
}

export interface DonationsByHour {
  [hour: string]: {
    count: number;
    amount: number;
  };
}

export interface ChainRoundStats {
  chainId: number;
  roundId: string;
  totalDonations: number;
  totalAmountDonatedInUsd: number;
  uniqueDonors: number;
  tokenUsage: TokenUsage;
  donationsByHour: DonationsByHour;
  averageDonationAmount: number;
  medianDonationAmount: number;
  topDonors: {
    donorAddress: string;
    totalDonated: number;
    donationCount: number;
  }[];
  donationDistribution: {
    small: number;  // < $10
    medium: number; // $10 - $100
    large: number;  // > $100
  };
  timeStats: {
    firstDonation: string;
    lastDonation: string;
    averageTimeBetweenDonations: number;
  };
  lastUpdated: number; // timestamp of when this data was last fetched
}

export interface DonationContextType {
  donationsData: DonationNode[];
  isDonationsLoading: boolean;
  tokenUsage: TokenUsage;
  donationsByHour: DonationsByHour;
  chainRoundStats: ChainRoundStats[];
  fetchDonationsForRounds: (params: {
    chainId: number;
    roundIds: string[];
    programId: string;
  }) => Promise<void>;
  getRoundStats: (chainId: number, roundId: string) => ChainRoundStats | undefined;
  isRoundDataStale: (chainId: number, roundId: string, maxAgeInHours?: number) => boolean;
}

export type AggregateData = {
  donationsAggregate: { aggregate: { count: number } };
  roundsAggregate: { aggregate: { sum: {
    matchAmountInUsd: number;
    fundedAmountInUsd: number;
    totalAmountDonatedInUsd: number;
    totalDonationsCount: number;
    matchAmount: number;
  } } };
  approvedApplications: { aggregate: { count: number } };
  rejectedApplications: { aggregate: { count: number } };
  allApplications: { aggregate: { count: number } };
};
