import { Resolvers } from "../generated/graphql";
import { queryResolvers } from "../resolvers/queryResolvers";

export const resolvers: Resolvers = {
	Query: queryResolvers,
};
