import { QueryResolvers } from "../generated/graphql";

export const queryResolvers: QueryResolvers = {
	hello: () => "Hello Hono!",
};
