import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { yogaHandler } from "./middleware/yoga-handler";
import { Context } from "./context";
import { createSchema, createYoga, YogaInitialContext } from "graphql-yoga";
import {
	constraintDirectiveTypeDefs,
	createEnvelopQueryValidationPlugin,
} from "graphql-constraint-directive";
import { loadFilesSync } from "@graphql-tools/load-files";
import {
	ResolveUserFn,
	useGenericAuth,
	ValidateUserFn,
} from "@envelop/generic-auth";
import { GraphQLError } from "graphql/error";

const typeDefs = [
	constraintDirectiveTypeDefs,
	...loadFilesSync("src/typeDefs/**/*.graphql"),
];

const resolvers = loadFilesSync("src/resolvers/rootResolvers.ts");

type UserType = {
	id: string;
};

const resolveUserFn: ResolveUserFn<UserType, Context> = async (context) => {
	// DBとかに接続して
	return {
		id: "aaa",
	};
};

const validateUser: ValidateUserFn<UserType> = (params) => {
	const { user } = params;
	if (user.id !== "bbb") {
		return new GraphQLError("Unauthenticated.");
	}
};

async function createContext(
	initialContext: YogaInitialContext,
): Promise<Context> {
	return {
		name: "test",
	};
}

const yoga = createYoga({
	schema: createSchema({ typeDefs, resolvers }),
	context: createContext,
	plugins: [
		createEnvelopQueryValidationPlugin(),
		useGenericAuth({
			resolveUserFn,
			validateUser,
			mode: "protect-granular",
		}),
	],
});

const app = new Hono();
app.use(
	yoga.graphqlEndpoint,
	yogaHandler<{}, Context>({
		yoga,
	}),
);

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
