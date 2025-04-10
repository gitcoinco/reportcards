import { TokenUsage, DonationNode, DonationsByHour } from "../types";

export const getTokenUsage = (donations: DonationNode[]): TokenUsage => {
    return donations.reduce((acc, donation) => {
      const { tokenAddress } = donation;
      if (!acc[tokenAddress]) {
        acc[tokenAddress] = 0;
      }
      acc[tokenAddress]++;
      return acc;
    }, {} as TokenUsage);
  };
  
export const getDonationsByHour = (donations: DonationNode[]): DonationsByHour => {
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