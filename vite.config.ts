import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
	server: {
		minify: false,
	},
	build: {
		minify: false,
	},
	plugins: [viteSingleFile()],
})
