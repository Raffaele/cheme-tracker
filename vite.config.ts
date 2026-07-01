import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

const base = process.env.NODE_ENV === 'production' ? '/cheme-tracker' : '';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: null,
			kit: {
				base: `${base}/`
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
						src: `${base}/icon-192.png`,
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: `${base}/icon-512.png`,
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: `${base}/icon-512.png`,
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		})
	]
});
