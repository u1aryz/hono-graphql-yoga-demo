import { YogaServerInstance } from "graphql-yoga";
import { Context, MiddlewareHandler } from "hono";

type Recordable = Record<string, unknown>;

type Options<T extends Recordable, U extends Recordable> = {
	yoga: YogaServerInstance<T, U>;
};

export const yogaHandler = <T extends Recordable, U extends Recordable>({
	yoga,
}: Options<T, U>): MiddlewareHandler => {
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
