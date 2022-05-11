import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  files: ['tests/**/*.ts'],
  plugins: [esbuildPlugin({ ts: true })],
};
