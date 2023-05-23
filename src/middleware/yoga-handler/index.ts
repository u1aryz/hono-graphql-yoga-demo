import { YogaServerInstance } from "graphql-yoga";
import { Context, MiddlewareHandler } from "hono";

type Props = Record<string, unknown>;

type Options<T extends Props, U extends Props> = {
	yoga: YogaServerInstance<T, U>;
};

export const yogaHandler = <T extends Props, U extends Props>({
	yoga,
}: Options<T, U>): MiddlewareHandler => {
	return async (c: Context) => {
		const { req } = c;
		const body = await req.arrayBuffer();
		const response = await yoga.fetch(req.url, {
			method: req.method,
			headers: req.headers,
			body,
		});
		const result = await response.text();
		const headers = Object.fromEntries(response.headers.entries());
		// お好みで
		// return c.text(result, response.status, headers);
		return c.text(result, 200, headers);
	};
};
