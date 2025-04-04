import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://beta.indexer.gitcoin.co/v1/graphql';

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT); 