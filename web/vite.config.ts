import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.IS_GITHUB_ACTION ? "" : "./",
    plugins: [svelte()],
    optimizeDeps: {
        exclude: ["@slofp/aijs"],
    },
});
