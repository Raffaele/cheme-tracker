<script lang="ts">
	import { tracker } from '$lib/tracker.svelte.js';
	import { i18n, LOCALE_LABELS } from '$lib/i18n.svelte.js';
	import type { LocaleCode } from '$lib/i18n.svelte.js';

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
