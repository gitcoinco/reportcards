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

export const GET_PROGRAM_WITH_ROUND_ID = gql`
  query getPrograms {
    rounds(where: {donations: {amountInUsd: {_gte: "50"}}, project: {tags: {_contains: "program"}}, uniqueDonorsCount: {_gte: 10}}, orderBy: {createdAtBlock: DESC}) {
      id
      chainId
      projectId
      roundMetadata
      matchTokenAddress
      project {
        name
        id
      }
    }
  }
`; 

export const GET_PROGRAM_AGGREGATE_DATA = gql`
  query getProgramAggregateData($projectId: String!, $roundIds: [String!]!) {
    donationsAggregate(where: {round: {projectId: {_eq: $projectId}}, roundId: {_in: $roundIds}}) {
      aggregate {
        count(columns: donorAddress, distinct: true)
      }
    }
    roundsAggregate(where: {projectId: {_eq: $projectId}, id: {_in: $roundIds}}) {
      aggregate {
        sum {
          matchAmountInUsd
          matchAmount
          fundedAmountInUsd
          totalAmountDonatedInUsd
          totalDonationsCount
        }
      }
    }
    approvedApplications: applicationsAggregate(where: {round: {projectId: {_eq: $projectId}}, roundId: {_in: $roundIds}, status: {_eq: "APPROVED"}}) {
      aggregate {
        count(columns: id)
      }
    }
    rejectedApplications: applicationsAggregate(where: {round: {projectId: {_eq: $projectId}}, roundId: {_in: $roundIds}, status: {_eq: "REJECTED"}}) {
      aggregate {
        count(columns: id)
      }
    }
    allApplications: applicationsAggregate(where: {round: {projectId: {_eq: $projectId}}, roundId: {_in: $roundIds}}) {
      aggregate {
        count(columns: id)
      }
    }
  }
`; 

export const GET_PROGRAM_DONATIONS = gql`
  query getProgramDonations($chainId: Int!, $roundIds: [String!]!, $limit: Int!, $offset: Int!) {
    donations(
      where: {
        chainId: {_eq: $chainId}, 
        roundId: {_in: $roundIds}
      },
      limit: $limit,
      offset: $offset
    ) {
      amount
      amountInUsd
      applicationId
      timestamp
      chainId
      id
      donorAddress
      recipientAddress
      projectId
      roundId
      tokenAddress
      application {
        project {
          id
          name
        }
      }
    }
  }
`; 



// export const GET_PROGRAM_DATA = gql`
// query getProgramData($programId: String!) {
//   rounds(where: {donations: {amountInUsd: {_gte: "50"}}, project: {tags: {_contains: "program"}, id: {_eq: $programId}}, uniqueDonorsCount: {_gte: 10}}, orderBy: {createdAtBlock: DESC}) {
//     id
//     chainId
//     projectId
//     project {
//       name
//       id
//     }
//     applications {
//       projectId
//       status
//       totalAmountDonatedInUsd
//       totalDonationsCount
//       uniqueDonorsCount
//     }
//     fundedAmountInUsd
//     matchAmountInUsd
//     matchingDistribution
//     totalAmountDonatedInUsd
//     totalDonationsCount
//     totalDistributed
//     uniqueDonorsCount
//     donations {
//       donorAddress
//       recipientAddress
//       amountInUsd
//     }
//   }
// }
// `; 