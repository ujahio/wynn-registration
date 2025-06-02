module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js", "json", "node"],
	testPathIgnorePatterns: ["/node_modules/", "/.next/", "tests/"],
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				isolatedModules: true,
			},
		],
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
};
