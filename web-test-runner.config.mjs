import { summaryReporter } from "@web/test-runner";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

const browsers = [playwrightLauncher({ product: "chromium" })];

if (process.env.CI) {
  browsers.push(
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
  );
}

export default {
  nodeResolve: true,
  coverage: true,
  files: ["tests/**/*.ts", "tests/**/*.js"],
  plugins: [esbuildPlugin({ ts: true, target: "esnext" })],
  browsers,
  reporters: [summaryReporter()],
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
