import { Context, Hono } from "hono";
import { graphqlServer } from "@hono/graphql-server";
import { serve } from "@hono/node-server";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";

export const app = new Hono();

const schema = loadSchemaSync("src/typeDefs/**/*.graphql", {
	loaders: [new GraphQLFileLoader()],
});

const rootResolver = (ctx: Context) => {
	return {
		hello: () => "Hello Hono!",
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
