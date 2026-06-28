<script lang="ts">
	import { tracker } from '$lib/tracker.svelte.js';
	import { i18n } from '$lib/i18n.svelte.js';

	let showMedForm = $state(false);
	let newMed = $state({ name: '', everyday: true, days: [] as number[], times: ['08:00'] });

	const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

	function toggleMedDay(d: number) {
		if (newMed.days.includes(d)) {
			newMed.days = newMed.days.filter((x) => x !== d);
		} else {
			newMed.days = [...newMed.days, d].sort();
		}
	}

	function addMedTime() {
		newMed.times = [...newMed.times, '08:00'];
	}

	function removeMedTime(i: number) {
		newMed.times = newMed.times.filter((_, idx) => idx !== i);
	}

	function updateMedTime(i: number, val: string) {
		newMed.times = newMed.times.map((t, idx) => (idx === i ? val : t));
	}

	function submitMed() {
		if (!newMed.name.trim() || newMed.times.length === 0) return;
		if (!newMed.everyday && newMed.days.length === 0) return;
		tracker.addMedicine({
			name: newMed.name.trim(),
			days: newMed.everyday ? 'everyday' : newMed.days,
			times: newMed.times.slice().sort()
		});
		newMed = { name: '', everyday: true, days: [], times: ['08:00'] };
		showMedForm = false;
	}
</script>

<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
	<div class="flex items-center justify-between">
		<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
			{i18n.t('med_title')}
		</h2>
		<button
			onclick={() => (showMedForm = !showMedForm)}
			aria-expanded={showMedForm}
			class="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px]"
		>
			{showMedForm ? i18n.t('med_cancel') : i18n.t('med_add')}
		</button>
	</div>

	{#if showMedForm}
		<div class="mt-4 space-y-4 rounded-xl bg-slate-50 p-4">
			<div>
				<label for="med-name" class="sr-only">{i18n.t('med_name_input')}</label>
				<input
					id="med-name"
					type="text"
					bind:value={newMed.name}
					placeholder={i18n.t('med_name_input')}
					class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
				/>
			</div>

			<div>
				<p class="mb-2 text-xs font-medium text-slate-600">{i18n.t('med_days_label')}</p>
				<label class="flex items-center gap-2 mb-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={newMed.everyday}
						class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-sm text-slate-700">{i18n.t('med_everyday')}</span>
				</label>
				{#if !newMed.everyday}
					<div class="flex flex-wrap gap-1.5" role="group" aria-label={i18n.t('med_days_label')}>
						{#each ALL_DAYS as d (d)}
							{@const active = newMed.days.includes(d)}
							<button
								type="button"
								onclick={() => toggleMedDay(d)}
								aria-pressed={active}
								class="rounded-lg border px-3 py-2 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px] {active
									? 'border-blue-300 bg-blue-100 text-blue-700'
									: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}"
							>
								{i18n.t(`med_day_${d}` as Parameters<typeof i18n.t>[0])}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div>
				<p class="mb-2 text-xs font-medium text-slate-600">{i18n.t('med_times_label')}</p>
				<div class="space-y-2">
					{#each newMed.times as time, idx (idx)}
						<div class="flex items-center gap-2">
							<input
								type="time"
								value={time}
								oninput={(e) => updateMedTime(idx, (e.target as HTMLInputElement).value)}
								class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
							/>
							{#if newMed.times.length > 1}
								<button
									type="button"
									onclick={() => removeMedTime(idx)}
									class="text-slate-400 hover:text-rose-600 transition-colors text-lg leading-none min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
									aria-label="Rimuovi orario"
								>
									<span aria-hidden="true">×</span>
								</button>
							{/if}
						</div>
					{/each}
				</div>
				<button
					type="button"
					onclick={addMedTime}
					class="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded min-h-[44px] px-1"
				>
					{i18n.t('med_add_time')}
				</button>
			</div>

			<button
				onclick={submitMed}
				class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
			>
				{i18n.t('med_save')}
			</button>
		</div>
	{/if}

	<div class="mt-4 space-y-2" aria-live="polite">
		{#if tracker.medicines.length === 0}
			<p class="text-center text-sm text-slate-600 py-4">{i18n.t('med_empty')}</p>
		{:else}
			{#each tracker.medicines as med (med.id)}
				<div class="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3">
					<span aria-hidden="true" class="text-xl shrink-0 mt-0.5">💊</span>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-slate-800">{med.name}</p>
						<p class="mt-0.5 text-xs text-slate-600">
							{med.days === 'everyday'
								? i18n.t('med_everyday')
								: (med.days as number[])
										.map((d) => i18n.t(`med_day_${d}` as Parameters<typeof i18n.t>[0]))
										.join(', ')}
						</p>
						<div class="mt-1 flex flex-wrap gap-1">
							{#each med.times as time (time)}
								<span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{time}</span>
							{/each}
						</div>
						{#if med.takenLog}
							{@const entries = Object.entries(med.takenLog).sort((a, b) => a[0].localeCompare(b[0]))}
							{#each entries as [scheduled, record] (scheduled)}
								<p class="mt-0.5 text-xs text-slate-500">
									{i18n.t('med_last_taken')} ({scheduled}): {record.date} {record.takenAt}
								</p>
							{/each}
						{/if}
					</div>
					<button
						onclick={() => tracker.removeMedicine(med.id)}
						class="text-slate-400 hover:text-rose-600 transition-colors motion-reduce:transition-none text-lg leading-none shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
						aria-label="{i18n.t('med_remove_aria')}: {med.name}"
					>
						<span aria-hidden="true">×</span>
					</button>
				</div>
			{/each}
		{/if}
	</div>
</div>
