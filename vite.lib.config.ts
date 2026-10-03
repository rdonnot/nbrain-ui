import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import pkg from './package.json' with {type:'json'};
const external=[...Object.keys(pkg.dependencies),...Object.keys(pkg.peerDependencies)];
export default defineConfig({plugins:[react()],publicDir:false,define:{__NBRAIN_BRAND_URL__:"new URL('./assets/identity.png', import.meta.url).href"},build:{outDir:'dist',lib:{entry:{index:'src/index.ts',widgets:'src/widgets/index.ts'},formats:['es']},sourcemap:true,rolldownOptions:{external:(id)=>external.some(p=>id===p||id.startsWith(p+'/'))}}});
