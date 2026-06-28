<script lang="ts">
	import { i18n } from '$lib/i18n.svelte.js';
	import { renderSVG } from 'uqr';
	import { browser } from '$app/environment';

	const qrSvg = $derived(browser ? renderSVG(window.location.href) : '');

	type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };
	let installPrompt = $state<BeforeInstallPromptEvent | null>(null);
	let installed = $state(false);

	$effect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			installPrompt = e as BeforeInstallPromptEvent;
		};
		window.addEventListener('beforeinstallprompt', handler);
		window.addEventListener('appinstalled', () => { installed = true; installPrompt = null; });
		return () => window.removeEventListener('beforeinstallprompt', handler);
	});

	async function installApp() {
		if (!installPrompt) return;
		await installPrompt.prompt();
		installPrompt = null;
	}
</script>

{#if qrSvg}
	<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
		<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
			{i18n.t('qr_title')}
		</h2>
		<p class="mt-1 text-xs text-slate-600">{i18n.t('qr_description')}</p>
		<div class="mt-4 flex justify-center">
			<div
				class="w-48 h-48 rounded-xl overflow-hidden"
				role="img"
				aria-label="{i18n.t('qr_title')}: {typeof window !== 'undefined' ? window.location.href : ''}"
			>
				{@html qrSvg}
			</div>
		</div>
		<p class="mt-3 text-center text-[11px] text-slate-600 break-all">
			{typeof window !== 'undefined' ? window.location.href : ''}
		</p>
	</div>
{/if}

{#if installPrompt && !installed}
	<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
		<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
			{i18n.t('install_btn')}
		</h2>
		<p class="mt-1 text-xs text-slate-600">{i18n.t('install_hint')}</p>
		<button
			onclick={installApp}
			class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
			</svg>
			{i18n.t('install_btn')}
		</button>
	</div>
{/if}
