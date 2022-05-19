import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  open: true,
  plugins: [esbuildPlugin({ ts: true, target: 'auto'})],
};
