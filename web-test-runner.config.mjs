import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

const browsers = [
  playwrightLauncher({ product: 'chromium' }),
]

if (process.env.CI) {
  browsers.push(
    playwrightLauncher({ product: 'firefox' }),
    // playwrightLauncher({ product: 'webkit' }),
  )
}

export default {
  nodeResolve: true,
  coverage: true,
  files: ['tests/**/*.ts'],
  plugins: [esbuildPlugin({ ts: true, target: 'esnext' })],
  browsers,
};
