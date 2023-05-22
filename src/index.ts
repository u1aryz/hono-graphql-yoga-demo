import { createSchema, createYoga } from "graphql-yoga";
import { loadFilesSync } from "@graphql-tools/load-files";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import {
	constraintDirectiveTypeDefs,
	createEnvelopQueryValidationPlugin,
} from "graphql-constraint-directive";
import { yogaHandler } from "./middleware/yoga-handler";

const typeDefs = [
	constraintDirectiveTypeDefs,
	loadFilesSync("src/typeDefs/**/*.graphql"),
];
const resolvers = loadFilesSync("src/resolvers/rootResolvers.ts");

const yoga = createYoga({
	schema: createSchema({ typeDefs, resolvers }),
	context: ({ request }) => {
		// here inject context
		return {
			name: "Hono",
		};
	},
	plugins: [createEnvelopQueryValidationPlugin()],
});

const app = new Hono();
app.use(yoga.graphqlEndpoint, yogaHandler({ yoga }));

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
