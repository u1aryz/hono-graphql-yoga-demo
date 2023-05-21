import { Context, Hono } from "hono";
import { buildSchema } from "graphql";
import { graphqlServer } from "@hono/graphql-server";
import { serve } from "@hono/node-server";

export const app = new Hono();

const schema = buildSchema(`
type Query {
  hello: String
}
`);

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
