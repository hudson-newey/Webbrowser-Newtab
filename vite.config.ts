import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
	server: {},
	plugins: [viteSingleFile()],
})
