<script lang="ts">
	import { tracker } from '$lib/tracker.svelte.js';
	import { i18n } from '$lib/i18n.svelte.js';

	let showFoodForm = $state(false);
	let newFood = $state({ name: '', days: 1 });

	function submitFood() {
		if (newFood.name.trim() && newFood.days >= 0) {
			tracker.addFood(newFood.name.trim(), newFood.days);
			newFood = { name: '', days: 1 };
			showFoodForm = false;
		}
	}
</script>

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
				{@const today = (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; })()}
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
