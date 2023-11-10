import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        root: path.resolve(__dirname, ''),
        build: { outDir: '../../web' },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('src/', import.meta.url))
            }
        }
    };
});
