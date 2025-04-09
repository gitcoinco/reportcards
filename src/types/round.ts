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
    isDonationsLoading: boolean;
    error: Error | null;
    tokenUsage: { [tokenAddress: string]: number };
    activeProgramId: string | null;
    activeProgram: Program | null;
    setActiveProgramId: (id: string | null) => void;
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