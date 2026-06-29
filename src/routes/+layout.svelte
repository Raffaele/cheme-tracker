<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import { setupInstallListener } from '$lib/install.svelte.js';

	const { children } = $props();

	$effect(() => {
		if (browser) setupInstallListener();
	});
</script>

{@render children()}
