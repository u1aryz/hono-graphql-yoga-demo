import { QueryResolvers } from "../generated/graphql";

export const queryResolvers: QueryResolvers = {
	hello: (parent, args, context) => `Hello ${context.name}!`,
};
