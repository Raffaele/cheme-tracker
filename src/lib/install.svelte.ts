type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };

declare global {
	interface Window {
		__installPrompt: BeforeInstallPromptEvent | null;
		__appInstalled?: boolean;
	}
}

let _installPrompt = $state<BeforeInstallPromptEvent | null>(null);
let _installed = $state(false);

export const installState = {
	get prompt() { return _installPrompt; },
	get installed() { return _installed; },
	clear() { _installPrompt = null; },
};

export function setupInstallListener() {
	// Pick up event already captured before Svelte hydration
	if (window.__installPrompt) {
		_installPrompt = window.__installPrompt;
	}
	if (window.__appInstalled) {
		_installed = true;
	}

	// Also listen for future fires (e.g. re-navigation)
	window.addEventListener('installpromptready', () => {
		_installPrompt = window.__installPrompt;
	});
	window.addEventListener('appinstalled', () => {
		_installed = true;
		_installPrompt = null;
	});
}
