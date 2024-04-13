import { defineConfig } from "vite"
// import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
	server: {
		minify: false,
		rollupOptions: {
			treeshake: false
		}
	},
	build: {
		minify: false,
	}
})
