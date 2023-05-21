import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "src/typeDefs/*.graphql",
	generates: {
		"src/generated/graphql.ts": {
			plugins: ["typescript", "typescript-resolvers"],
		},
		"./graphql.schema.json": {
			plugins: ["introspection"],
		},
	},
	config: {
		contextType: "../context#Context",
	},
};

export default config;
