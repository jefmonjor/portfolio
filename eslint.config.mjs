import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfigNextDefaultIgnores = [
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
];
const localReferenceRepoClones = [".agent-context/**"];
const installedAgentSkills = [".agents/**"];
const localAgentWorktrees = [".claude/**"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ...eslintConfigNextDefaultIgnores,
    ...localReferenceRepoClones,
    ...installedAgentSkills,
    ...localAgentWorktrees,
  ]),
]);

export default eslintConfig;
