import { YogaInitialContext } from "graphql-yoga";
import { Context, MiddlewareHandler } from "hono";
import {
	constraintDirectiveTypeDefs,
	createEnvelopQueryValidationPlugin,
} from "graphql-constraint-directive";
import { loadFilesSync } from "@graphql-tools/load-files";
import { createSchema, createYoga } from "graphql-yoga";

const typeDefs = [
	constraintDirectiveTypeDefs,
	...loadFilesSync("src/typeDefs/**/*.graphql"),
];
const resolvers = loadFilesSync("src/resolvers/rootResolvers.ts");

type Options<T extends Record<string, unknown>> = {
	createContext: (initialContext: YogaInitialContext) => Promise<T>;
	graphqlEndpoint?: string;
};

export const yogaHandler = <T extends Record<string, unknown>>({
	createContext,
	graphqlEndpoint,
}: Options<T>): MiddlewareHandler => {
	const yoga = createYoga({
		schema: createSchema({ typeDefs, resolvers }),
		context: createContext,
		plugins: [createEnvelopQueryValidationPlugin()],
		graphqlEndpoint,
	});

	return async (c: Context) => {
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
		return c.text(result, 200, headers);
	};
};
