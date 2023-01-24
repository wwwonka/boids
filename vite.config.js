import {defineConfig} from "vite";

// Vite plugins
import glsl from "vite-plugin-glsl";
import {ViteMinifyPlugin} from "vite-plugin-minify";
import mkcert from "vite-plugin-mkcert";
// import {terser} from "rollup-plugin-terser";

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
			plugins: [
				// terser({
				// 	compress: {
				// 		defaults: false,
				// 		drop_console: true,
				// 	},
				// 	mangle: {
				// 		eval: true,
				// 		module: true,
				// 		toplevel: true,
				// 		safari10: true,
				// 		properties: false,
				// 	},
				// 	output: {
				// 		comments: false,
				// 		ecma: "2020",
				// 	},
				// }),
			],
		},
	},
	server: {
		host: "0.0.0.0",
		port: "8080",
		https: true,
	},

	plugins: [
		glsl(),
		ViteMinifyPlugin({
			comments: false,
		}),
		mkcert({
			hosts: ["localhost", "local ip addrs", "macbook.local"],
		}),
		// PluginCritical({
		// 	criticalUrl: "./build/index.html",
		// 	criticalBase: "./build/",
		// 	criticalPages: [{uri: "", template: "index"}],
		// 	criticalConfig: {
		// 		inline: true,
		// 		extract: true,
		// 		target: {
		// 			html: "./index.html",
		// 			uncritical: "./scripts/index.css",
		// 		},
		// 	},
		// }),
		// cleanup(),
	],
});
