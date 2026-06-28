<script lang="ts">
	import { tracker } from '$lib/tracker.svelte.js';
	import { i18n } from '$lib/i18n.svelte.js';

	const hasAnyHistory = $derived(
		tracker.recentHistory.some((l) => l.waterMl > 0 || l.isBowelMovementRecorded)
	);

	function formatHistoryDate(dateStr: string): { day: string; weekday: string } {
		const d = new Date(dateStr + 'T00:00:00');
		return {
			day: d.toLocaleDateString(i18n.locale, { day: 'numeric', month: 'short' }),
			weekday: d.toLocaleDateString(i18n.locale, { weekday: 'short' })
		};
	}
</script>

{#if hasAnyHistory}
	<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
		<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
			{i18n.t('history_title')}
		</h2>
		<div class="mt-4 space-y-1">
			{#each tracker.recentHistory.filter((l) => l.waterMl > 0 || l.isBowelMovementRecorded) as log (log.date)}
				{@const dateInfo = formatHistoryDate(log.date)}
				{@const pct = Math.min(100, Math.round((log.waterMl / tracker.waterGoalMl) * 100))}
				<div class="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors motion-reduce:transition-none">
					<div class="w-20 shrink-0">
						<p class="text-xs font-medium capitalize text-slate-700">{dateInfo.weekday}</p>
						<p class="text-xs text-slate-600">{dateInfo.day}</p>
					</div>
					<div class="flex-1">
						<div class="flex items-center justify-between mb-1">
							<span class="text-xs text-slate-700">
								<span aria-hidden="true">💧</span> {log.waterMl} ml
							</span>
							<span class="text-xs text-slate-600">{pct}%</span>
						</div>
						<div
							role="progressbar"
							aria-valuenow={pct}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label="{dateInfo.weekday} {dateInfo.day} — {i18n.t('water_label')}"
							class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
						>
							<div
								class="h-full rounded-full transition-all motion-reduce:transition-none {pct >= 100 ? 'bg-emerald-400' : 'bg-blue-300'}"
								style="width: {pct}%"
							></div>
						</div>
					</div>
					<div class="shrink-0 w-8 text-center">
						{#if log.isBowelMovementRecorded}
							<span aria-label={i18n.t('bowel_label')} title={i18n.t('bowel_label')} class="text-base">🌿</span>
						{:else}
							<span aria-hidden="true" class="text-base opacity-20">🌿</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 text-center">
		<p class="text-sm text-slate-600 py-4">{i18n.t('history_title')}</p>
	</div>
{/if}
