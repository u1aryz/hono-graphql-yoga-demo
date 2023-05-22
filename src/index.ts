import { createSchema, createYoga } from "graphql-yoga";
import { loadFilesSync } from "@graphql-tools/load-files";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const typeDefs = loadFilesSync("src/typeDefs/**/*.graphql");
const resolvers = loadFilesSync("src/resolvers/rootResolvers.ts");

const yoga = createYoga({
	schema: createSchema({ typeDefs, resolvers }),
	context: ({ request }) => {
		// here inject context
		return {
			name: "Hono",
		};
	},
});

const app = new Hono();

app.use(yoga.graphqlEndpoint, async (c) => {
	const { req } = c;
	// The content-type must be application/json
	const params = await req.json();
	const response = await yoga.fetch(req.url, {
		method: req.method,
		headers: req.headers,
		body: JSON.stringify(params),
	});
	const result = await response.text();
	const headers = Object.fromEntries(response.headers.entries());
	return c.text(result, response.status, headers);
});

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
