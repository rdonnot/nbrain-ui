import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],base:'./',build:{outDir:"dist-demo",assetsInlineLimit:10000000},resolve:{alias:{'@':new URL('./src',import.meta.url).pathname}}});
