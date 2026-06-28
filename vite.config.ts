import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		}),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts',
							expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
						}
					}
				]
			},
			manifest: {
				name: 'Chemo Tracker',
				short_name: 'ChemoTracker',
				description: 'Traccia il tuo ciclo di chemioterapia, acqua e appuntamenti',
				theme_color: '#1e40af',
				background_color: '#f8fafc',
				display: 'standalone',
				orientation: 'portrait',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/icon-192.svg',
						sizes: '192x192',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					},
					{
						src: '/icon-192.svg',
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					}
				]
			}
		})
	]
});
