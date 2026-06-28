<script lang="ts">
	import { tracker } from '$lib/tracker.svelte.js';
	import { i18n, LOCALE_LABELS } from '$lib/i18n.svelte.js';
	import type { LocaleCode } from '$lib/i18n.svelte.js';
	import { renderSVG } from 'uqr';
	import { browser } from '$app/environment';

	// Reactive clock — updates every minute for medicine alerts
	let nowMinutes = $state(getNowMinutes());
	function getNowMinutes(): number {
		const d = new Date();
		return d.getHours() * 60 + d.getMinutes();
	}
	$effect(() => {
		const id = setInterval(() => { nowMinutes = getNowMinutes(); }, 60_000);
		return () => clearInterval(id);
	});

	// Medicine alerts: due within the next 30 minutes
	const medicineAlerts = $derived(
		tracker.todaysMedicines.flatMap((med) =>
			med.times
				.map((t) => {
					const [h, m] = t.split(':').map(Number);
					return { med, time: t, diffMin: h * 60 + m - nowMinutes };
				})
				.filter(({ diffMin }) => diffMin >= 0 && diffMin <= 30)
		)
	);

	let showAppointmentForm = $state(false);
	let showFoodForm = $state(false);
	let newFood = $state({ name: '', days: 1 });
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

	function submitFood() {
		if (newFood.name.trim() && newFood.days >= 0) {
			tracker.addFood(newFood.name.trim(), newFood.days);
			newFood = { name: '', days: 1 };
			showFoodForm = false;
		}
	}

	function submitAppointment() {
		if (newAppointment.date && newAppointment.time && newAppointment.title) {
			tracker.addAppointment(newAppointment);
			newAppointment = { date: '', time: '', title: '', notes: '' };
			showAppointmentForm = false;
		}
	}

	const locales = Object.keys(LOCALE_LABELS) as LocaleCode[];

	// PWA install prompt
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

	// Sync html[lang] to active locale
	$effect(() => {
		document.documentElement.lang = i18n.locale;
	});

	async function installApp() {
		if (!installPrompt) return;
		await installPrompt.prompt();
		installPrompt = null;
	}

	// QR code
	const qrSvg = $derived(browser ? renderSVG(window.location.href) : '');
</script>

<div class="min-h-screen bg-slate-50 pb-10">
	<!-- Header -->
	<header class="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-5 shadow-sm">
		<div class="max-w-lg mx-auto flex items-start justify-between gap-4">
			<div>
				<p class="text-xs font-medium uppercase tracking-widest text-slate-600">{i18n.t('app_name')}</p>
				<h1 class="mt-0.5 text-lg font-semibold capitalize text-slate-900">{todayFormatted}</h1>
			</div>
			<!-- Install button + Language switcher -->
			<div class="flex flex-col items-end gap-2 pt-1">
				{#if installPrompt && !installed}
					<button
						onclick={installApp}
						class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
						{i18n.t('install_btn')}
					</button>
				{/if}
				<div class="flex items-center gap-1" role="group" aria-label="Language">
					{#each locales as code (code)}
						<button
							onclick={() => i18n.setLocale(code)}
							aria-label={LOCALE_LABELS[code]}
							aria-pressed={i18n.locale === code}
							class="rounded-md px-2 py-1 text-xs font-medium uppercase transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px] min-w-[44px] {i18n.locale === code
								? 'bg-blue-100 text-blue-700'
								: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}"
						>
							{code}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-lg space-y-4 px-4 pt-5">
		<!-- Medicine alert -->
		{#if medicineAlerts.length > 0}
			<div role="alert" class="rounded-2xl border border-violet-200 bg-violet-50 p-4 flex items-start gap-3">
				<span aria-hidden="true" class="text-xl shrink-0">💊</span>
				<div class="min-w-0">
					<p class="text-sm font-semibold text-violet-800">{i18n.t('med_alert_title')}</p>
					<ul class="mt-1 space-y-0.5">
						{#each medicineAlerts as { med, time, diffMin } (med.id + time)}
							<li class="text-sm text-violet-700">
								{i18n.t('med_alert_msg').replace('{name}', med.name).replace('{time}', time)}
								{#if diffMin === 0}
									<span class="font-semibold"> — {i18n.t('med_alert_now')}</span>
								{:else}
									<span class="opacity-75"> ({diffMin} min)</span>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}

		<!-- Food alert -->
		{#if tracker.foodsDueToday.length > 0}
			<div
				role="alert"
				class="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3"
			>
				<span aria-hidden="true" class="text-xl shrink-0">🍽️</span>
				<div class="min-w-0">
					<p class="text-sm font-semibold text-amber-800">{i18n.t('food_alert_title')}</p>
					<ul class="mt-1 space-y-0.5">
						{#each tracker.foodsDueToday as food (food.id)}
							{@const isExpired = food.consumeBy < new Date().toISOString().split('T')[0]}
							<li class="text-sm {isExpired ? 'line-through text-amber-500' : 'text-amber-700'}">· {food.name}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}

		<!-- Bowel alert -->
		{#if tracker.daysSinceLastBowelMovement === null || tracker.daysSinceLastBowelMovement > 2}
			<div
				role="alert"
				class="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3"
			>
				<span aria-hidden="true" class="text-xl shrink-0">⚠️</span>
				<div>
					<p class="text-sm font-semibold text-rose-800">{i18n.t('bowel_alert_title')}</p>
					<p class="mt-0.5 text-sm text-rose-700">
						{i18n.t('bowel_alert_msg').replace('{days}', String(tracker.daysSinceLastBowelMovement ?? '30+'))}
					</p>
				</div>
			</div>
		{/if}

		<!-- Setup card -->
		{#if !tracker.cycleStartDate}
			<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
				<h2 class="text-base font-semibold text-slate-900">{i18n.t('setup_title')}</h2>
				<p class="mt-1 text-sm text-slate-600">{i18n.t('setup_description')}</p>
				<div class="mt-4 flex gap-3">
					<div class="flex-1">
						<label for="cycle-start-date" class="sr-only">{i18n.t('setup_title')}</label>
						<input
							id="cycle-start-date"
							type="date"
							bind:value={cycleStartInput}
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
						/>
					</div>
					<button
						onclick={submitCycleStart}
						class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
					>
						{i18n.t('setup_start')}
					</button>
				</div>
			</div>
		{:else}
			<!-- Cycle Status Card -->
			{@const phase = tracker.currentPhase}
			<div class="rounded-2xl bg-white p-6 shadow-sm border {phase?.bgClass ?? 'border-slate-200'}">
				<div class="flex items-start justify-between">
					<div>
						<p class="text-xs font-medium uppercase tracking-widest text-slate-600">
							{i18n.t('cycle_day_label')}
						</p>
						{#if tracker.cycleDay}
							<div class="mt-1 flex items-baseline gap-2">
								<span class="text-5xl font-bold text-slate-900">{tracker.cycleDay}</span>
								<span class="text-lg text-slate-600">/ {tracker.cycleDays}</span>
							</div>
						{:else}
							<p class="mt-2 text-sm text-slate-600">{i18n.t('cycle_inactive')}</p>
						{/if}
					</div>
					{#if phase}
						<div class="rounded-xl px-3 py-1.5 text-xs font-semibold {phase.colorClass} {phase.bgClass} border">
							{phase.label} · {phase.description}
						</div>
					{/if}
				</div>

				<div class="mt-5">
					<div class="mb-1.5 flex justify-between text-xs text-slate-600">
						<span>{i18n.t('cycle_start')}</span>
						<span>{tracker.cycleProgress}%</span>
						<span>{i18n.t('cycle_end')}</span>
					</div>
					<div
						role="progressbar"
						aria-valuenow={tracker.cycleProgress}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label={i18n.t('cycle_day_label')}
						class="h-2 w-full overflow-hidden rounded-full bg-slate-100"
					>
						<div
							class="h-full rounded-full bg-blue-400 transition-all duration-500 motion-reduce:transition-none"
							style="width: {tracker.cycleProgress}%"
						></div>
					</div>
				</div>

				<div class="mt-4 flex gap-1" aria-hidden="true">
					{#each [1, 2, 3, 4] as p (p)}
						{@const info = tracker.getPhaseInfo(p as 1 | 2 | 3 | 4)}
						{@const isActive = tracker.currentPhase?.phase === p}
						<div class="flex-1">
							<div class="h-1.5 rounded-full {isActive ? 'bg-blue-400' : 'bg-slate-200'} transition-colors motion-reduce:transition-none"></div>
							<p class="mt-1 text-center text-[10px] text-slate-600">{info.label}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Today's Log -->
		<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
			<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
				{i18n.t('daily_log_title')}
			</h2>

			<!-- Water intake -->
			<div class="mt-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<span aria-hidden="true" class="text-xl">💧</span>
						<div>
							<p class="text-sm font-medium text-slate-800">{i18n.t('water_label')}</p>
							<p class="text-xs text-slate-600">
								{tracker.todayLog.waterMl} ml · {waterCups} {i18n.t('water_cups')} · {i18n.t('water_goal')} {tracker.waterGoalMl} ml
							</p>
						</div>
					</div>
					<button
						onclick={() => (showWaterConfig = !showWaterConfig)}
						class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
						aria-label={i18n.t('water_config_aria')}
						aria-expanded={showWaterConfig}
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
						</svg>
					</button>
				</div>

				{#if showWaterConfig}
					<div class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
						<p id="water-config-hint" class="mb-2 text-xs font-medium text-slate-600">{i18n.t('water_config_hint')}</p>
						<div class="flex flex-wrap gap-2" role="group" aria-describedby="water-config-hint">
							{#each tracker.allWaterButtons as btn (btn.id)}
								{@const isActive = tracker.activeWaterButtons.includes(btn.id)}
								<button
									onclick={() => tracker.toggleWaterButton(btn.id)}
									aria-pressed={isActive}
									class="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px] {isActive
										? 'border-blue-300 bg-blue-100 text-blue-700'
										: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}"
								>
									<span aria-hidden="true">{btn.emoji}</span>
									<span>{btn.label}</span>
									<span class="text-[10px] opacity-70">{btn.shortLabel}</span>
								</button>
							{/each}
						</div>
						<div class="mt-3 border-t border-slate-200 pt-3">
							<label for="water-goal-input" class="mb-2 block text-xs font-medium text-slate-600">{i18n.t('water_goal_label')}</label>
							<div class="flex items-center gap-2">
								<input
									id="water-goal-input"
									type="number"
									min="100"
									step="100"
									bind:value={waterGoalInput}
									onchange={applyWaterGoal}
									class="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
								/>
								<span class="text-xs text-slate-600" aria-hidden="true">ml</span>
								<span class="text-xs text-slate-600">({(waterGoalInput / 1000).toFixed(2).replace(/\.?0+$/, '')} L)</span>
							</div>
						</div>
					</div>
				{/if}

				<div class="mt-3 flex flex-wrap gap-2">
					{#if tracker.activeWaterButtonDefs.length === 0}
						<p class="text-xs text-slate-600 italic">{i18n.t('water_no_buttons')}</p>
					{:else}
						{#each tracker.activeWaterButtonDefs as btn (btn.id)}
							<div class="flex items-center gap-1">
								<button
									onclick={() => tracker.updateWater(-btn.ml)}
									class="flex h-11 w-11 items-center justify-center rounded-l-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors motion-reduce:transition-none text-base leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
									aria-label="{i18n.t('water_remove_aria')} {btn.label}"
								>−</button>
								<div class="flex h-11 items-center gap-1 border-y border-slate-200 bg-white px-2" aria-hidden="true">
									<span>{btn.emoji}</span>
									<span class="text-xs text-slate-600">{btn.shortLabel}</span>
								</div>
								<button
									onclick={() => tracker.updateWater(btn.ml)}
									class="flex h-11 w-11 items-center justify-center rounded-r-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors motion-reduce:transition-none text-base leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
									aria-label="{i18n.t('water_add_aria')} {btn.label}"
								>+</button>
							</div>
						{/each}
					{/if}
				</div>

				<div
					role="progressbar"
					aria-valuenow={waterPercent}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={i18n.t('water_label')}
					class="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"
				>
					<div
						class="h-full rounded-full bg-blue-300 transition-all duration-300 motion-reduce:transition-none"
						style="width: {waterPercent}%"
					></div>
				</div>
				{#if waterPercent >= 100}
					<p class="mt-1 text-xs font-medium text-emerald-700" aria-live="polite">{i18n.t('water_goal_reached')}</p>
				{/if}
			</div>

			<!-- Bowel movement -->
			<div class="mt-5 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span aria-hidden="true" class="text-xl">🌿</span>
					<div>
						<p class="text-sm font-medium text-slate-800">{i18n.t('bowel_label')}</p>
						<p class="text-xs text-slate-600">{i18n.t('bowel_hint')}</p>
					</div>
				</div>
				<button
					onclick={() => tracker.toggleBowelMovement()}
					class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 {tracker.todayLog.isBowelMovementRecorded ? 'bg-emerald-500' : 'bg-slate-300'}"
					role="switch"
					aria-checked={tracker.todayLog.isBowelMovementRecorded}
					aria-label={i18n.t('bowel_label')}
				>
					<span class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 motion-reduce:transition-none {tracker.todayLog.isBowelMovementRecorded ? 'translate-x-7' : 'translate-x-1'}"></span>
				</button>
			</div>
		</div>

		<!-- Appointments -->
		<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
					{i18n.t('appointments_title')}
				</h2>
				<button
					onclick={() => (showAppointmentForm = !showAppointmentForm)}
					aria-expanded={showAppointmentForm}
					class="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px]"
				>
					{showAppointmentForm ? i18n.t('appointments_cancel') : i18n.t('appointments_add')}
				</button>
			</div>

			{#if showAppointmentForm}
				<div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
					<div>
						<label for="appointment-title" class="sr-only">{i18n.t('appointments_title_input')}</label>
						<input
							id="appointment-title"
							type="text"
							bind:value={newAppointment.title}
							placeholder={i18n.t('appointments_title_input')}
							class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
						/>
					</div>
					<div class="flex gap-3">
						<div class="flex-1">
							<label for="appointment-date" class="sr-only">{i18n.t('appointments_title_input')} — data</label>
							<input
								id="appointment-date"
								type="date"
								bind:value={newAppointment.date}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
							/>
						</div>
						<div>
							<label for="appointment-time" class="sr-only">{i18n.t('appointments_title_input')} — ora</label>
							<input
								id="appointment-time"
								type="time"
								bind:value={newAppointment.time}
								class="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
							/>
						</div>
					</div>
					<div>
						<label for="appointment-notes" class="sr-only">{i18n.t('appointments_notes_input')}</label>
						<input
							id="appointment-notes"
							type="text"
							bind:value={newAppointment.notes}
							placeholder={i18n.t('appointments_notes_input')}
							class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
						/>
					</div>
					<button
						onclick={submitAppointment}
						class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
					>
						{i18n.t('appointments_save')}
					</button>
				</div>
			{/if}

			<div class="mt-4 space-y-3" aria-live="polite">
				{#if tracker.upcomingAppointments.length === 0}
					<p class="text-center text-sm text-slate-600 py-4">{i18n.t('appointments_empty')}</p>
				{:else}
					{#each tracker.upcomingAppointments as appointment (appointment.id)}
						<div class="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
							<div class="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-800" aria-hidden="true">
								<span class="text-xs font-bold leading-none">
									{new Date(appointment.date + 'T00:00:00').getDate()}
								</span>
								<span class="text-[10px] uppercase leading-none">
									{new Date(appointment.date + 'T00:00:00').toLocaleDateString(i18n.locale, { month: 'short' })}
								</span>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-slate-800 truncate">{appointment.title}</p>
								<p class="text-xs text-slate-600">{formatAppointmentDate(appointment.date)} · {appointment.time}</p>
								{#if appointment.notes}
									<p class="mt-0.5 text-xs text-slate-600 truncate">{appointment.notes}</p>
								{/if}
							</div>
							<button
								onclick={() => tracker.removeAppointment(appointment.id)}
								class="text-slate-400 hover:text-rose-600 transition-colors motion-reduce:transition-none text-lg leading-none shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
								aria-label="{i18n.t('appointments_remove_aria')}: {appointment.title}"
							>
								<span aria-hidden="true">×</span>
							</button>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Foods -->
		<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
					{i18n.t('food_title')}
				</h2>
				<button
					onclick={() => (showFoodForm = !showFoodForm)}
					aria-expanded={showFoodForm}
					class="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 min-h-[44px]"
				>
					{showFoodForm ? i18n.t('food_cancel') : i18n.t('food_add')}
				</button>
			</div>

			{#if showFoodForm}
				<div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
					<div>
						<label for="food-name" class="sr-only">{i18n.t('food_name_input')}</label>
						<input
							id="food-name"
							type="text"
							bind:value={newFood.name}
							placeholder={i18n.t('food_name_input')}
							class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
						/>
					</div>
					<div class="flex items-center gap-3">
						<label for="food-days" class="text-xs font-medium text-slate-700 whitespace-nowrap">{i18n.t('food_days_input')}</label>
						<input
							id="food-days"
							type="number"
							min="0"
							step="1"
							bind:value={newFood.days}
							class="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
						/>
					</div>
					<button
						onclick={submitFood}
						class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
					>
						{i18n.t('food_save')}
					</button>
				</div>
			{/if}

			<div class="mt-4 space-y-2" aria-live="polite">
				{#if tracker.foods.length === 0}
					<p class="text-center text-sm text-slate-600 py-4">{i18n.t('food_empty')}</p>
				{:else}
					{#each tracker.foods.slice().sort((a, b) => a.consumeBy.localeCompare(b.consumeBy)) as food (food.id)}
						{@const today = new Date().toISOString().split('T')[0]}
						{@const isExpired = food.consumeBy < today}
						{@const isDueToday = food.consumeBy === today}
						<div class="flex items-center gap-3 rounded-xl px-3 py-2.5 {isDueToday ? 'bg-amber-50 border border-amber-200' : isExpired ? 'bg-slate-50 opacity-70' : 'bg-slate-50'}">
							<span aria-hidden="true" class="text-base">{isDueToday ? '⚠️' : isExpired ? '🗑️' : '🥗'}</span>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate {isExpired ? 'line-through text-slate-500' : 'text-slate-800'}">
									{food.name}
									{#if isExpired}<span class="sr-only"> (scaduto)</span>{/if}
								</p>
								<p class="text-xs {isDueToday ? 'text-amber-700 font-medium' : 'text-slate-600'}">
									{i18n.t('food_expires')} {new Date(food.consumeBy + 'T00:00:00').toLocaleDateString(i18n.locale, { day: 'numeric', month: 'short' })}
								</p>
							</div>
							<button
								onclick={() => tracker.removeFood(food.id)}
								class="text-slate-400 hover:text-rose-600 transition-colors motion-reduce:transition-none text-lg leading-none shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
								aria-label="{i18n.t('food_remove_aria')}: {food.name}"
							>
								<span aria-hidden="true">×</span>
							</button>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Medicines -->
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
					<!-- Name -->
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

					<!-- Days -->
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

					<!-- Times -->
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

		<!-- History -->
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
		{/if}

		<!-- QR code -->
		{#if qrSvg}
			<div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
				<h2 class="text-sm font-semibold uppercase tracking-widest text-slate-600">
					{i18n.t('qr_title')}
				</h2>
				<p class="mt-1 text-xs text-slate-600">{i18n.t('qr_description')}</p>
				<div class="mt-4 flex justify-center">
					<div class="w-48 h-48 rounded-xl overflow-hidden" role="img" aria-label="{i18n.t('qr_title')}: {typeof window !== 'undefined' ? window.location.href : ''}">
						{@html qrSvg}
					</div>
				</div>
				<p class="mt-3 text-center text-[11px] text-slate-600 break-all">{typeof window !== 'undefined' ? window.location.href : ''}</p>
			</div>
		{/if}
	</main>
</div>
