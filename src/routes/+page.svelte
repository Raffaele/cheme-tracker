<script lang="ts">
	import { tracker } from '$lib/tracker.svelte.js';
	import { i18n, LOCALE_LABELS } from '$lib/i18n.svelte.js';
	import type { LocaleCode } from '$lib/i18n.svelte.js';

	let showAppointmentForm = $state(false);
	let showWaterConfig = $state(false);
	let waterGoalInput = $state(tracker.waterGoalMl);

	function applyWaterGoal() {
		const ml = Math.round(waterGoalInput);
		if (ml > 0) tracker.setWaterGoal(ml);
	}

	let newAppointment = $state({ date: '', time: '', title: '', notes: '' });
	let cycleStartInput = $state('');

	const todayFormatted = $derived(
		new Date().toLocaleDateString(i18n.locale, {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		})
	);

	const waterCups = $derived(Math.floor(tracker.todayLog.waterMl / 250));
	const waterPercent = $derived(
		Math.min(100, Math.round((tracker.todayLog.waterMl / tracker.waterGoalMl) * 100))
	);

	function formatHistoryDate(dateStr: string): { day: string; weekday: string } {
		const d = new Date(dateStr + 'T00:00:00');
		return {
			day: d.toLocaleDateString(i18n.locale, { day: 'numeric', month: 'short' }),
			weekday: d.toLocaleDateString(i18n.locale, { weekday: 'short' })
		};
	}

	const hasAnyHistory = $derived(
		tracker.recentHistory.some((l) => l.waterMl > 0 || l.isBowelMovementRecorded)
	);

	function formatAppointmentDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString(i18n.locale, { weekday: 'short', day: 'numeric', month: 'short' });
	}

	function submitCycleStart() {
		if (cycleStartInput) tracker.setCycleStartDate(cycleStartInput);
	}

	function submitAppointment() {
		if (newAppointment.date && newAppointment.time && newAppointment.title) {
			tracker.addAppointment(newAppointment);
			newAppointment = { date: '', time: '', title: '', notes: '' };
			showAppointmentForm = false;
		}
	}

	const locales = Object.keys(LOCALE_LABELS) as LocaleCode[];
</script>

<div class="min-h-screen bg-slate-50 pb-10">
	<!-- Header -->
	<header class="bg-white border-b border-slate-100 px-4 py-5 shadow-sm">
		<div class="max-w-lg mx-auto flex items-start justify-between gap-4">
			<div>
				<p class="text-xs font-medium uppercase tracking-widest text-slate-400">{i18n.t('app_name')}</p>
				<h1 class="mt-0.5 text-lg font-semibold capitalize text-slate-800">{todayFormatted}</h1>
			</div>
			<!-- Language switcher -->
			<div class="flex items-center gap-1 pt-1">
				{#each locales as code (code)}
					<button
						onclick={() => i18n.setLocale(code)}
						class="rounded-md px-2 py-1 text-xs font-medium uppercase transition-colors {i18n.locale === code
							? 'bg-blue-100 text-blue-700'
							: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}"
					>
						{code}
					</button>
				{/each}
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-lg space-y-4 px-4 pt-5">
		<!-- Setup card -->
		{#if !tracker.cycleStartDate}
			<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
				<h2 class="text-base font-semibold text-slate-800">{i18n.t('setup_title')}</h2>
				<p class="mt-1 text-sm text-slate-500">{i18n.t('setup_description')}</p>
				<div class="mt-4 flex gap-3">
					<input
						type="date"
						bind:value={cycleStartInput}
						class="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
					/>
					<button
						onclick={submitCycleStart}
						class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
					>
						{i18n.t('setup_start')}
					</button>
				</div>
			</div>
		{:else}
			<!-- Cycle Status Card -->
			{@const phase = tracker.currentPhase}
			<div class="rounded-2xl bg-white p-6 shadow-sm border {phase?.bgClass ?? 'border-slate-100'}">
				<div class="flex items-start justify-between">
					<div>
						<p class="text-xs font-medium uppercase tracking-widest text-slate-400">
							{i18n.t('cycle_day_label')}
						</p>
						{#if tracker.cycleDay}
							<div class="mt-1 flex items-baseline gap-2">
								<span class="text-5xl font-bold text-slate-800">{tracker.cycleDay}</span>
								<span class="text-lg text-slate-400">/ {tracker.cycleDays}</span>
							</div>
						{:else}
							<p class="mt-2 text-sm text-slate-500">{i18n.t('cycle_inactive')}</p>
						{/if}
					</div>
					{#if phase}
						<div class="rounded-xl px-3 py-1.5 text-xs font-semibold {phase.colorClass} {phase.bgClass} border">
							{phase.label} · {phase.description}
						</div>
					{/if}
				</div>

				<div class="mt-5">
					<div class="mb-1.5 flex justify-between text-xs text-slate-400">
						<span>{i18n.t('cycle_start')}</span>
						<span>{tracker.cycleProgress}%</span>
						<span>{i18n.t('cycle_end')}</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							class="h-full rounded-full bg-blue-400 transition-all duration-500"
							style="width: {tracker.cycleProgress}%"
						></div>
					</div>
				</div>

				<div class="mt-4 flex gap-1">
					{#each [1, 2, 3, 4] as phase (phase)}
						{@const info = tracker.getPhaseInfo(phase as 1 | 2 | 3 | 4)}
						{@const isActive = tracker.currentPhase?.phase === phase}
						<div class="flex-1">
							<div class="h-1.5 rounded-full {isActive ? 'bg-blue-400' : 'bg-slate-200'} transition-colors"></div>
							<p class="mt-1 text-center text-[10px] text-slate-400">{info.label}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Today's Log -->
		<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
			<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-400">
				{i18n.t('daily_log_title')}
			</h2>

			<!-- Water intake -->
			<div class="mt-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<span class="text-xl">💧</span>
						<div>
							<p class="text-sm font-medium text-slate-700">{i18n.t('water_label')}</p>
							<p class="text-xs text-slate-400">
								{tracker.todayLog.waterMl} ml · {waterCups} {i18n.t('water_cups')} · {i18n.t('water_goal')} {tracker.waterGoalMl} ml
							</p>
						</div>
					</div>
					<button
						onclick={() => (showWaterConfig = !showWaterConfig)}
						class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
						aria-label={i18n.t('water_config_aria')}
						title={i18n.t('water_config_aria')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
						</svg>
					</button>
				</div>

				{#if showWaterConfig}
					<div class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
						<p class="mb-2 text-xs font-medium text-slate-500">{i18n.t('water_config_hint')}</p>
						<div class="flex flex-wrap gap-2">
							{#each tracker.allWaterButtons as btn (btn.id)}
								{@const isActive = tracker.activeWaterButtons.includes(btn.id)}
								<button
									onclick={() => tracker.toggleWaterButton(btn.id)}
									class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors {isActive
										? 'border-blue-300 bg-blue-100 text-blue-700'
										: 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}"
								>
									<span>{btn.emoji}</span>
									<span>{btn.label}</span>
									<span class="text-[10px] opacity-60">{btn.shortLabel}</span>
								</button>
							{/each}
						</div>
						<div class="mt-3 border-t border-slate-200 pt-3">
							<p class="mb-2 text-xs font-medium text-slate-500">{i18n.t('water_goal_label')}</p>
							<div class="flex items-center gap-2">
								<input
									type="number"
									min="100"
									step="100"
									bind:value={waterGoalInput}
									onchange={applyWaterGoal}
									class="w-28 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
								/>
								<span class="text-xs text-slate-400">ml</span>
								<span class="text-xs text-slate-400">({(waterGoalInput / 1000).toFixed(2).replace(/\.?0+$/, '')} L)</span>
							</div>
						</div>
					</div>
				{/if}

				<div class="mt-3 flex flex-wrap gap-2">
					{#if tracker.activeWaterButtonDefs.length === 0}
						<p class="text-xs text-slate-400 italic">{i18n.t('water_no_buttons')}</p>
					{:else}
						{#each tracker.activeWaterButtonDefs as btn (btn.id)}
							<div class="flex items-center gap-1">
								<button
									onclick={() => tracker.updateWater(-btn.ml)}
									class="flex h-8 w-8 items-center justify-center rounded-l-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors text-base leading-none"
									aria-label="{i18n.t('water_remove_aria')} {btn.label}"
								>−</button>
								<div class="flex h-8 items-center gap-1 border-y border-slate-200 bg-white px-2">
									<span class="text-sm">{btn.emoji}</span>
									<span class="text-xs text-slate-500">{btn.shortLabel}</span>
								</div>
								<button
									onclick={() => tracker.updateWater(btn.ml)}
									class="flex h-8 w-8 items-center justify-center rounded-r-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-base leading-none"
									aria-label="{i18n.t('water_add_aria')} {btn.label}"
								>+</button>
							</div>
						{/each}
					{/if}
				</div>

				<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
					<div
						class="h-full rounded-full bg-blue-300 transition-all duration-300"
						style="width: {waterPercent}%"
					></div>
				</div>
				{#if waterPercent >= 100}
					<p class="mt-1 text-xs font-medium text-emerald-600">{i18n.t('water_goal_reached')}</p>
				{/if}
			</div>

			<!-- Bowel movement -->
			<div class="mt-5 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-xl">🌿</span>
					<div>
						<p class="text-sm font-medium text-slate-700">{i18n.t('bowel_label')}</p>
						<p class="text-xs text-slate-400">{i18n.t('bowel_hint')}</p>
					</div>
				</div>
				<button
					onclick={() => tracker.toggleBowelMovement()}
					class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none {tracker.todayLog.isBowelMovementRecorded ? 'bg-emerald-400' : 'bg-slate-200'}"
					role="switch"
					aria-checked={tracker.todayLog.isBowelMovementRecorded}
					aria-label={i18n.t('bowel_label')}
				>
					<span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 {tracker.todayLog.isBowelMovementRecorded ? 'translate-x-6' : 'translate-x-1'}"></span>
				</button>
			</div>
		</div>

		<!-- Appointments -->
		<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-400">
					{i18n.t('appointments_title')}
				</h2>
				<button
					onclick={() => (showAppointmentForm = !showAppointmentForm)}
					class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
				>
					{showAppointmentForm ? i18n.t('appointments_cancel') : i18n.t('appointments_add')}
				</button>
			</div>

			{#if showAppointmentForm}
				<div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
					<input
						type="text"
						bind:value={newAppointment.title}
						placeholder={i18n.t('appointments_title_input')}
						class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
					/>
					<div class="flex gap-3">
						<input
							type="date"
							bind:value={newAppointment.date}
							class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
						/>
						<input
							type="time"
							bind:value={newAppointment.time}
							class="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
						/>
					</div>
					<input
						type="text"
						bind:value={newAppointment.notes}
						placeholder={i18n.t('appointments_notes_input')}
						class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
					/>
					<button
						onclick={submitAppointment}
						class="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
					>
						{i18n.t('appointments_save')}
					</button>
				</div>
			{/if}

			<div class="mt-4 space-y-3">
				{#if tracker.upcomingAppointments.length === 0}
					<p class="text-center text-sm text-slate-400 py-4">{i18n.t('appointments_empty')}</p>
				{:else}
					{#each tracker.upcomingAppointments as appointment (appointment.id)}
						<div class="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
							<div class="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-700">
								<span class="text-xs font-bold leading-none">
									{new Date(appointment.date + 'T00:00:00').getDate()}
								</span>
								<span class="text-[10px] uppercase leading-none">
									{new Date(appointment.date + 'T00:00:00').toLocaleDateString(i18n.locale, { month: 'short' })}
								</span>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-slate-700 truncate">{appointment.title}</p>
								<p class="text-xs text-slate-400">{formatAppointmentDate(appointment.date)} · {appointment.time}</p>
								{#if appointment.notes}
									<p class="mt-0.5 text-xs text-slate-400 truncate">{appointment.notes}</p>
								{/if}
							</div>
							<button
								onclick={() => tracker.removeAppointment(appointment.id)}
								class="text-slate-300 hover:text-rose-400 transition-colors text-lg leading-none shrink-0"
								aria-label={i18n.t('appointments_remove_aria')}
							>×</button>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- History -->
		{#if hasAnyHistory}
			<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
				<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-400">
					{i18n.t('history_title')}
				</h2>
				<div class="mt-4 space-y-1">
					{#each tracker.recentHistory.filter((l) => l.waterMl > 0 || l.isBowelMovementRecorded) as log (log.date)}
						{@const dateInfo = formatHistoryDate(log.date)}
						{@const pct = Math.min(100, Math.round((log.waterMl / tracker.waterGoalMl) * 100))}
						<div class="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors">
							<div class="w-20 shrink-0">
								<p class="text-xs font-medium capitalize text-slate-500">{dateInfo.weekday}</p>
								<p class="text-xs text-slate-400">{dateInfo.day}</p>
							</div>
							<div class="flex-1">
								<div class="flex items-center justify-between mb-1">
									<span class="text-xs text-slate-500">💧 {log.waterMl} ml</span>
									<span class="text-xs text-slate-400">{pct}%</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
									<div
										class="h-full rounded-full transition-all {pct >= 100 ? 'bg-emerald-400' : 'bg-blue-300'}"
										style="width: {pct}%"
									></div>
								</div>
							</div>
							<div class="shrink-0 w-6 text-center">
								{#if log.isBowelMovementRecorded}
									<span class="text-base" title={i18n.t('bowel_label')}>🌿</span>
								{:else}
									<span class="text-base opacity-20">🌿</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</main>
</div>
