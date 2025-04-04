export interface Application {
    id: string;
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
}

export interface PlotData {
    labels: string[];
    values: number[];
}

export interface LeaderboardEntry {
    projectName: string;
    uniqueDonorsCount: number;
    totalAmountDonatedInUsd: number;
    matchedUsd: number;
    totalAmount: number;
    rank: number;
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
    leaderboard: LeaderboardEntry[];
} 