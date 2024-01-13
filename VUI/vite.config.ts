import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig, PluginOption, UserConfigFn } from 'vite';
import vue from '@vitejs/plugin-vue';

const userCfgFn: UserConfigFn = () => {
    return {
        plugins: [vue()] as PluginOption[],
        base: '/vui/',
        root: path.resolve(__dirname, 'web-src/vui'),
        build: { outDir: './web/vui/' },
        dev: { host: true },
        server: {
            host: true,
            port: 5173,
            hot: true
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('web-src/vui/src/', import.meta.url))
            }
        }
    };
};

// https://vitejs.dev/config/
export default defineConfig(userCfgFn);
