export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"refactor",
				"perf",
				"docs",
				"style",
				"test",
				"ci",
				"chore",
			],
		],
		"subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
		"subject-empty": [2, "never"],
		"subject-full-stop": [2, "never", "."],
		"type-case": [2, "always", "lowercase"],
		"type-empty": [2, "never"],
	},
};
