// eslint-disable-next-line foo
import { env } from "node:process";

import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";
import { junitReporter } from "@web/test-runner-junit-reporter";

const browsers = [playwrightLauncher({ product: "chromium" })];

const config = {
  nodeResolve: true,
  coverage: true,
  files: ["tests/**/*.ts", "tests/**/*.js"],
  plugins: [esbuildPlugin({ ts: true, target: "esnext" })],
  browsers,
  filterBrowserLogs(log) {
    if (
      typeof log.args[0] === "string" &&
      log.args[0].includes(
        "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.",
      )
    ) {
      return false;
    }
    return true;
  },
};

if (env.CI) {
  config.browsers.push(
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
  );
}

export default config;
