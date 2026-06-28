<script lang="ts">
	import { i18n } from '$lib/i18n.svelte.js';
	import TabSummary from '$lib/components/TabSummary.svelte';
	import TabShare from '$lib/components/TabShare.svelte';
	import TabSettings from '$lib/components/TabSettings.svelte';

	const todayFormatted = $derived(
		new Date().toLocaleDateString(i18n.locale, {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		})
	);

	let activeTab = $state<'summary' | 'share' | 'settings'>('summary');

	$effect(() => {
		document.documentElement.lang = i18n.locale;
	});
</script>

<div class="min-h-screen bg-slate-50 pb-24">
	<!-- Header -->
	<header class="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-5 shadow-sm">
		<div class="max-w-lg mx-auto">
			<p class="text-xs font-medium uppercase tracking-widest text-slate-600">{i18n.t('app_name')}</p>
			<h1 class="mt-0.5 text-lg font-semibold capitalize text-slate-900">{todayFormatted}</h1>
		</div>
	</header>

	<main class="mx-auto max-w-lg space-y-4 px-4 pt-5">
		{#if activeTab === 'summary'}
			<TabSummary />
		{:else if activeTab === 'share'}
			<TabShare />
		{:else if activeTab === 'settings'}
			<TabSettings />
		{/if}
	</main>

	<!-- Sticky footer tab bar -->
	<nav
		class="fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-200 bg-white shadow-[0_-1px_8px_0_rgba(0,0,0,0.06)]"
		aria-label="Sezioni"
	>
		<button
			onclick={() => (activeTab = 'summary')}
			aria-current={activeTab === 'summary' ? 'page' : undefined}
			class="relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset min-h-[56px] {activeTab === 'summary' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path d="M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM2 8a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM2 12a1 1 0 011-1h8a1 1 0 110 2H3a1 1 0 01-1-1z" />
			</svg>
			{i18n.t('tab_summary')}
			{#if activeTab === 'summary'}
				<span class="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-blue-600"></span>
			{/if}
		</button>
		<button
			onclick={() => (activeTab = 'share')}
			aria-current={activeTab === 'share' ? 'page' : undefined}
			class="relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset min-h-[56px] {activeTab === 'share' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
			</svg>
			{i18n.t('tab_share')}
			{#if activeTab === 'share'}
				<span class="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-blue-600"></span>
			{/if}
		</button>
		<button
			onclick={() => (activeTab = 'settings')}
			aria-current={activeTab === 'settings' ? 'page' : undefined}
			class="relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset min-h-[56px] {activeTab === 'settings' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
			</svg>
			{i18n.t('tab_settings')}
			{#if activeTab === 'settings'}
				<span class="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-blue-600"></span>
			{/if}
		</button>
	</nav>
</div>
