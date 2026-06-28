import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.NODE_ENV === 'production' ? '/cheme-tracker' : '';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			base,
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}']
			},
			manifest: {
				name: 'Chemo Tracker',
				short_name: 'ChemoTracker',
				description: 'Traccia il tuo ciclo di chemioterapia, acqua e appuntamenti',
				theme_color: '#1e40af',
				background_color: '#f8fafc',
				display: 'standalone',
				orientation: 'portrait',
				scope: `${base}/`,
				start_url: `${base}/`,
				icons: [
					{
						src: `${base}/icon-192.svg`,
						sizes: '192x192',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					},
					{
						src: `${base}/icon-192.svg`,
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					}
				]
			}
		})
	]
});
