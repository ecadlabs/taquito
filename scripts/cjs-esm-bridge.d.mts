import type { Plugin } from 'rollup';

export function cjsEsmBridge(pkg: {
  main: string;
  module: string;
  exports: { '.': { import: string; module: string } };
}): Plugin;
