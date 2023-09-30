import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
		  // Serve files from the parent directory of the project root
		  strict: false,
		  // The directory to serve files from
		  allow: ['../'],
		},
	  },
});
