<script lang="ts">
	let {
		title,
		description,
		confirmLabel,
		cancelLabel,
		onConfirm,
		onCancel
	}: {
		title: string;
		description: string;
		confirmLabel: string;
		cancelLabel: string;
		onConfirm: () => void;
		onCancel: () => void;
	} = $props();

	const uid = $props.id();
	let cancelBtnEl = $state<HTMLButtonElement | undefined>();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			onCancel();
		}
	}

	$effect(() => {
		cancelBtnEl?.focus();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 p-4">
	<button
		type="button"
		class="absolute inset-0 h-full w-full cursor-default"
		aria-label={cancelLabel}
		onclick={onCancel}
	></button>
	<div
		role="alertdialog"
		aria-modal="true"
		aria-labelledby="{uid}-title"
		aria-describedby="{uid}-desc"
		tabindex="-1"
		class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
	>
		<h2 id="{uid}-title" class="text-base font-semibold text-slate-900">{title}</h2>
		<p id="{uid}-desc" class="mt-1 text-sm text-slate-600">{description}</p>
		<div class="mt-5 flex gap-3">
			<button
				bind:this={cancelBtnEl}
				onclick={onCancel}
				class="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
			>
				{cancelLabel}
			</button>
			<button
				onclick={onConfirm}
				class="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 min-h-[44px]"
			>
				{confirmLabel}
			</button>
		</div>
	</div>
</div>
