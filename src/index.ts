import { Hono } from "hono";
import { graphqlServer } from "@hono/graphql-server";
import { serve } from "@hono/node-server";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { queryResolvers } from "./resolvers/queryResolvers";

export const app = new Hono();

const schema = loadSchemaSync("src/typeDefs/**/*.graphql", {
	loaders: [new GraphQLFileLoader()],
});

const rootResolver = (ctx: unknown) => {
	return {
		...queryResolvers,
	};
};

app.use(
	"/graphql",
	graphqlServer({
		schema,
		rootResolver,
	}),
);

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
