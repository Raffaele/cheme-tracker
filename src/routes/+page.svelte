<script lang="ts">
	import { i18n } from '$lib/i18n.svelte.js';
	import TabSummary from '$lib/components/TabSummary.svelte';
	import TabHistory from '$lib/components/TabHistory.svelte';
	import TabMedicines from '$lib/components/TabMedicines.svelte';
	import TabFoods from '$lib/components/TabFoods.svelte';
	import TabSettings from '$lib/components/TabSettings.svelte';

	const todayFormatted = $derived(
		new Date().toLocaleDateString(i18n.locale, {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		})
	);

	type Tab = 'summary' | 'history' | 'medicines' | 'foods' | 'settings';
	let activeTab = $state<Tab>('summary');

	$effect(() => {
		document.documentElement.lang = i18n.locale;
	});

	const tabs: { id: Tab; labelKey: Parameters<typeof i18n.t>[0]; icon: string }[] = [
		{
			id: 'summary',
			labelKey: 'tab_summary',
			icon: 'M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM2 8a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM2 12a1 1 0 011-1h8a1 1 0 110 2H3a1 1 0 01-1-1z'
		},
		{
			id: 'history',
			labelKey: 'tab_history',
			icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
		},
		{
			id: 'medicines',
			labelKey: 'tab_medicines',
			icon: 'M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
		},
		{
			id: 'foods',
			labelKey: 'tab_foods',
			icon: 'M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z'
		},
		{
			id: 'settings',
			labelKey: 'tab_settings',
			icon: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
		}
	];
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
			<TabSummary onNavigateFoods={() => (activeTab = 'foods')} />
		{:else if activeTab === 'history'}
			<TabHistory />
		{:else if activeTab === 'medicines'}
			<TabMedicines />
		{:else if activeTab === 'foods'}
			<TabFoods />
		{:else if activeTab === 'settings'}
			<TabSettings />
		{/if}
	</main>

	<!-- Sticky footer tab bar -->
	<nav
		class="fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-200 bg-white shadow-[0_-1px_8px_0_rgba(0,0,0,0.06)]"
		aria-label="Sezioni"
	>
		{#each tabs as tab (tab.id)}
			<button
				onclick={() => (activeTab = tab.id)}
				aria-current={activeTab === tab.id ? 'page' : undefined}
				class="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset min-h-[52px] {activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd" d={tab.icon} clip-rule="evenodd" />
				</svg>
				{i18n.t(tab.labelKey)}
				{#if activeTab === tab.id}
					<span class="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-blue-600"></span>
				{/if}
			</button>
		{/each}
	</nav>
</div>
