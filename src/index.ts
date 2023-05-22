import { createSchema, createYoga } from "graphql-yoga";
import { loadFilesSync } from "@graphql-tools/load-files";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { parseBody } from "@hono/graphql-server/dist/parse-body";

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
	const params = await parseBody(req.raw);
	const response = await yoga.fetch(req.url, {
		method: req.method,
		headers: req.headers,
		body: JSON.stringify(params),
	});
	const result = await response.text();
	const headers = Object.fromEntries(response.headers.entries());
	return c.json(JSON.parse(result), response.status, headers);
});

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
