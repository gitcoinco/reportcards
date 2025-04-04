import { gql } from 'graphql-request';

export const GET_ROUND = gql`
  query GetRound($chainId: Int!, $id: String!) {
    rounds(where: {chainId: {_eq: $chainId}, id: {_eq: $id}}) {
      id
      matchAmount
      matchAmountInUsd
      totalDonationsCount
      totalAmountDonatedInUsd
      uniqueDonorsCount
      roundMetadata
      matchTokenAddress
      applicationsStartTime
      applicationsEndTime
      donationsStartTime
      donationsEndTime
      projectId
      strategyName
      matchingDistribution
      applications(where: {status: {_eq: "APPROVED"}}) {
        id
        projectId
        uniqueDonorsCount
        totalAmountDonatedInUsd
        metadata
      }
    }
  }
`; 