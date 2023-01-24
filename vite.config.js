import {defineConfig} from "vite";

import ViteMinifyPlugin from "vite-plugin-minify";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
	root: "src/", // index.html goes inside src/ folder
	publicDir: "../static/", // Relative to the root
	build: {
		outDir: "../build/",
		assetsDir: "scripts/",
		emptyOutDir: true,
		chunkSizeWarningLimit: 10485760,
		assetsInlineLimit: 4096, // 4kb
		rollupOptions: {
			output: {
				entryFileNames: `scripts/[name].js`,
				chunkFileNames: `scripts/[name].js`,
				assetFileNames: `scripts/[name].[ext]`,
			},
		},
	},
	server: {
		host: "0.0.0.0",
		port: "8080",
		https: true,
	},

	plugins: [
		mkcert({
			hosts: ["localhost", "local ip addrs", "macbook.local"],
		}),
		ViteMinifyPlugin({
			comments: false,
		}),
	],
});
