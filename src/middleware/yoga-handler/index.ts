import { YogaServerInstance } from "graphql-yoga";
import { Context, MiddlewareHandler } from "hono";

type Options = {
	yoga: YogaServerInstance<{}, { name: string }>;
};

export const yogaHandler = ({ yoga }: Options): MiddlewareHandler => {
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
