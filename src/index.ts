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

const typeDefs = [
	constraintDirectiveTypeDefs,
	...loadFilesSync("src/typeDefs/**/*.graphql"),
];

const resolvers = loadFilesSync("src/resolvers/rootResolvers.ts");

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
	plugins: [createEnvelopQueryValidationPlugin()],
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
