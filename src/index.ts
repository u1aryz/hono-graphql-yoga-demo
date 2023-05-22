import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { yogaHandler } from "./middleware/yoga-handler";
import { Context } from "./context";

const app = new Hono();
app.use(
	"/graphql",
	yogaHandler<Context>({
		createContext: async ({ request }) => {
			return {
				name: "test",
			};
		},
	}),
);

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
