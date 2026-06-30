<script lang="ts">
	import { tracker } from '$lib/tracker.svelte.js';
	import { i18n, LOCALE_LABELS } from '$lib/i18n.svelte.js';
	import type { LocaleCode } from '$lib/i18n.svelte.js';
	import { browser } from '$app/environment';
	import { renderSVG } from 'uqr';
	import { installState } from '$lib/install.svelte.js';

	const qrSvg = $derived(browser ? renderSVG(window.location.href) : '');

	let copied = $state(false);
	async function copyUrl() {
		await navigator.clipboard.writeText(window.location.href);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	async function installApp() {
		if (!installState.prompt) return;
		await installState.prompt.prompt();
		installState.clear();
	}

	const locales = Object.keys(LOCALE_LABELS) as LocaleCode[];

	let waterGoalInput = $state(tracker.waterGoalMl);

	function applyWaterGoal() {
		const ml = Math.round(waterGoalInput);
		if (ml > 0) tracker.setWaterGoal(ml);
	}
</script>

<!-- Lingua -->
<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
	<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600 mb-4">
		{i18n.t('settings_language_title')}
	</h2>
	<div class="flex flex-wrap gap-2" role="group" aria-label={i18n.t('settings_language_title')}>
		{#each locales as code (code)}
			<button
				onclick={() => i18n.setLocale(code)}
				aria-label={LOCALE_LABELS[code]}
				aria-pressed={i18n.locale === code}
				class="flex-1 rounded-xl border px-3 py-3 text-sm font-medium uppercase transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px] {i18n.locale === code
					? 'border-blue-300 bg-blue-100 text-blue-700'
					: 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'}"
			>
				{code}
			</button>
		{/each}
	</div>
</div>

<!-- Acqua -->
<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
	<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600 mb-4">
		{i18n.t('settings_water_title')}
	</h2>
	<div class="mb-5">
		<label for="water-goal-input" class="mb-2 block text-xs font-medium text-slate-600">
			{i18n.t('water_goal_label')}
		</label>
		<div class="flex items-center gap-2">
			<input
				id="water-goal-input"
				type="number"
				min="100"
				step="100"
				bind:value={waterGoalInput}
				onchange={applyWaterGoal}
				class="w-28 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
			/>
			<span class="text-xs text-slate-600" aria-hidden="true">ml</span>
			<span class="text-xs text-slate-600">({(waterGoalInput / 1000).toFixed(2).replace(/\.?0+$/, '')} L)</span>
		</div>
	</div>
	<p id="water-config-hint" class="mb-2 text-xs font-medium text-slate-600">{i18n.t('water_config_hint')}</p>
	<div class="flex flex-wrap gap-2" role="group" aria-describedby="water-config-hint">
		{#each tracker.allWaterButtons as btn (btn.id)}
			{@const isActive = tracker.activeWaterButtons.includes(btn.id)}
			<button
				onclick={() => tracker.toggleWaterButton(btn.id)}
				aria-pressed={isActive}
				class="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px] {isActive
					? 'border-blue-300 bg-blue-100 text-blue-700'
					: 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'}"
			>
				<span aria-hidden="true">{btn.emoji}</span>
				<span>{btn.label}</span>
				<span class="text-[10px] opacity-70">{btn.shortLabel}</span>
			</button>
		{/each}
	</div>
</div>

<!-- Condivisione -->
{#if qrSvg}
<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
	<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
		{i18n.t('qr_title')}
	</h2>
	<p class="mt-1 text-sm text-slate-700">{i18n.t('qr_description')}</p>
	<div class="mt-4 flex justify-center">
		<div
			class="w-48 h-48 rounded-xl overflow-hidden"
			role="img"
			aria-label="{i18n.t('qr_title')}: {typeof window !== 'undefined' ? window.location.href : ''}"
		>
			{@html qrSvg}
		</div>
	</div>
	<p class="mt-3 text-center text-sm text-slate-700 break-all">
		{typeof window !== 'undefined' ? window.location.href : ''}
	</p>
	<button
		onclick={copyUrl}
		class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
	>
		{#if copied}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
			</svg>
			<span class="text-emerald-700">{i18n.t('copy_url_done')}</span>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
				<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
			</svg>
			{i18n.t('copy_url')}
		{/if}
	</button>
</div>
{/if}

<!-- Installa -->
<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
	<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
		{i18n.t('install_btn')}
	</h2>
	<p class="mt-1 text-sm text-slate-700">{i18n.t('install_hint')}</p>

	{#if installState.prompt && !installState.installed}
		<button
			onclick={installApp}
			class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
			</svg>
			{i18n.t('install_btn')}
		</button>
	{:else if !installState.installed}
		<div class="mt-4 space-y-3">
			<div class="rounded-xl border border-slate-200 p-4">
				<p class="text-sm font-semibold text-slate-900">Android Chrome</p>
				<p class="mt-1 text-sm text-slate-800">{i18n.t('install_android')}</p>
			</div>
			<div class="rounded-xl border border-slate-200 p-4">
				<p class="text-sm font-semibold text-slate-900">iPhone / iPad</p>
				<p class="mt-1 text-sm text-slate-800">{i18n.t('install_ios')}</p>
			</div>
		</div>
	{/if}
</div>
