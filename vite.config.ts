import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), tsconfigPaths(), react({
        babel: {
            plugins: [['babel-plugin-react-compiler']],
        },
    }), cloudflare()],
});