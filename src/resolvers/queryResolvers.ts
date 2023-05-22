import { QueryResolvers } from "../generated/graphql";

export const queryResolvers: QueryResolvers = {
	hello: (parent, { input }, context) => `Hello ${input.name}!`,
};
