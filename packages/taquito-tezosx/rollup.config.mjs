import typescript from 'rollup-plugin-typescript2';
export default {input:'src/taquito-tezosx.ts',output:{file:'dist/taquito-tezosx.mjs',format:'es',sourcemap:true},external:(id)=>!id.startsWith('.')&&!id.startsWith('/'),plugins:[typescript({tsconfig:'./tsconfig.prod.json',useTsconfigDeclarationDir:true})]};
