import type { Plugin } from 'rollup';

export function cjsEsmBridge(pkg: { main: string; exports: { '.': { import: string } } }): Plugin;
