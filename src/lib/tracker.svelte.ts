import type {
	TrackerData,
	DayLog,
	Appointment,
	CyclePhase,
	PhaseInfo,
	WaterButton,
	WaterButtonId,
	FoodItem,
	Medicine
} from './types.js';
import { i18n } from './i18n.svelte.js';

const STORAGE_KEY = 'chemo-tracker-data';
const DEFAULT_WATER_GOAL_ML = 2000;
const CYCLE_DAYS = 28;

const PHASE_STYLE: Record<CyclePhase, Pick<PhaseInfo, 'phase' | 'colorClass' | 'bgClass' | 'days'>> = {
	1: { phase: 1, colorClass: 'text-rose-600', bgClass: 'bg-rose-50 border-rose-200', days: [1, 4] },
	2: { phase: 2, colorClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-200', days: [5, 10] },
	3: { phase: 3, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 border-emerald-200', days: [11, 17] },
	4: { phase: 4, colorClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-200', days: [18, 28] }
};

function getPhaseInfo(phase: CyclePhase): PhaseInfo {
	const { t } = i18n;
	return {
		...PHASE_STYLE[phase],
		label: t(`phase_${phase}_label` as Parameters<typeof t>[0]),
		description: t(`phase_${phase}_desc` as Parameters<typeof t>[0])
	};
}

const WATER_BUTTON_BASE: Array<Pick<WaterButton, 'id' | 'ml' | 'emoji'>> = [
	{ id: 'glass', ml: 250, emoji: '🥛' },
	{ id: 'half_liter', ml: 500, emoji: '🍶' },
	{ id: 'liter', ml: 1000, emoji: '🫙' },
	{ id: 'gallon', ml: 3785, emoji: '🪣' }
];

function getAllWaterButtons(): WaterButton[] {
	const { t } = i18n;
	return WATER_BUTTON_BASE.map((b) => ({
		...b,
		label: t(`btn_${b.id}_label` as Parameters<typeof t>[0]),
		shortLabel: t(`btn_${b.id}_short` as Parameters<typeof t>[0])
	}));
}

const DEFAULT_WATER_BUTTONS: WaterButtonId[] = ['glass'];

function getPhaseForDay(cycleDay: number): CyclePhase {
	if (cycleDay <= 4) return 1;
	if (cycleDay <= 10) return 2;
	if (cycleDay <= 17) return 3;
	return 4;
}

function toDateString(date: Date): string {
	return date.toISOString().split('T')[0];
}

function loadData(): TrackerData {
	const empty = (): TrackerData => ({
		cycleStartDate: null,
		logs: {},
		appointments: [],
		activeWaterButtons: DEFAULT_WATER_BUTTONS,
		waterGoalMl: DEFAULT_WATER_GOAL_ML,
		foods: [],
		medicines: []
	});

	if (typeof localStorage === 'undefined') return empty();
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return empty();
	try {
		const parsed = JSON.parse(raw) as TrackerData;
		if (!parsed.activeWaterButtons) parsed.activeWaterButtons = DEFAULT_WATER_BUTTONS;
		if (!parsed.waterGoalMl) parsed.waterGoalMl = DEFAULT_WATER_GOAL_ML;
		if (!parsed.foods) parsed.foods = [];
		if (!parsed.medicines) parsed.medicines = [];
		return parsed;
	} catch {
		return empty();
	}
}

function saveData(data: TrackerData): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}
}

function createTracker() {
	const data = $state<TrackerData>(loadData());

	const todayString = toDateString(new Date());

	const cycleDay = $derived((): number | null => {
		if (!data.cycleStartDate) return null;
		const start = new Date(data.cycleStartDate);
		const today = new Date(todayString);
		const diffMs = today.getTime() - start.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
		if (diffDays < 1 || diffDays > CYCLE_DAYS) return null;
		return diffDays;
	});

	const currentPhase = $derived((): PhaseInfo | null => {
		const day = cycleDay();
		if (!day) return null;
		return getPhaseInfo(getPhaseForDay(day));
	});

	const cycleProgress = $derived((): number => {
		const day = cycleDay();
		if (!day) return 0;
		return Math.round((day / CYCLE_DAYS) * 100);
	});

	const todayLog = $derived((): DayLog => {
		return (
			data.logs[todayString] ?? {
				date: todayString,
				waterMl: 0,
				isBowelMovementRecorded: false
			}
		);
	});

	const upcomingAppointments = $derived((): Appointment[] => {
		return data.appointments
			.filter((a) => a.date >= todayString)
			.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
			.slice(0, 5);
	});

	const recentHistory = $derived((): DayLog[] => {
		const todayMs = new Date(todayString).getTime();
		const msPerDay = 1000 * 60 * 60 * 24;
		const days: DayLog[] = [];
		for (let i = 1; i <= 30; i++) {
			const dateStr = toDateString(new Date(todayMs - i * msPerDay));
			const log = data.logs[dateStr];
			days.push(log ?? { date: dateStr, waterMl: 0, isBowelMovementRecorded: false });
		}
		return days;
	});

	const foodsDueToday = $derived((): FoodItem[] => {
		return data.foods.filter((f) => f.consumeBy <= todayString);
	});

	const daysSinceLastBowelMovement = $derived((): number | null => {
		const todayMs = new Date(todayString).getTime();
		const msPerDay = 1000 * 60 * 60 * 24;
		for (let i = 0; i <= 30; i++) {
			const dateStr = toDateString(new Date(todayMs - i * msPerDay));
			if (data.logs[dateStr]?.isBowelMovementRecorded) return i;
		}
		return null;
	});

	const allWaterButtons = $derived((): WaterButton[] => getAllWaterButtons());

	const activeWaterButtonDefs = $derived((): WaterButton[] => {
		return allWaterButtons().filter((b) => data.activeWaterButtons.includes(b.id));
	});

	function setCycleStartDate(dateString: string): void {
		data.cycleStartDate = dateString;
		saveData(data);
	}

	function updateWater(ml: number): void {
		const log = data.logs[todayString] ?? {
			date: todayString,
			waterMl: 0,
			isBowelMovementRecorded: false
		};
		data.logs[todayString] = { ...log, waterMl: Math.max(0, log.waterMl + ml) };
		saveData(data);
	}

	function toggleBowelMovement(): void {
		const log = data.logs[todayString] ?? {
			date: todayString,
			waterMl: 0,
			isBowelMovementRecorded: false
		};
		data.logs[todayString] = {
			...log,
			isBowelMovementRecorded: !log.isBowelMovementRecorded
		};
		saveData(data);
	}

	function setWaterGoal(ml: number): void {
		if (ml > 0) {
			data.waterGoalMl = ml;
			saveData(data);
		}
	}

	function toggleWaterButton(id: WaterButtonId): void {
		const active = data.activeWaterButtons;
		if (active.includes(id)) {
			data.activeWaterButtons = active.filter((b) => b !== id);
		} else {
			// preserve display order from ALL_WATER_BUTTONS
			data.activeWaterButtons = WATER_BUTTON_BASE.map((b) => b.id).filter(
				(b) => active.includes(b) || b === id
			);
		}
		saveData(data);
	}

	function addFood(name: string, daysUntilExpiry: number): void {
		const todayMs = new Date(todayString).getTime();
		const consumeBy = toDateString(new Date(todayMs + daysUntilExpiry * 1000 * 60 * 60 * 24));
		data.foods = [...data.foods, { id: crypto.randomUUID(), name, consumeBy }];
		saveData(data);
	}

	function removeFood(id: string): void {
		data.foods = data.foods.filter((f) => f.id !== id);
		saveData(data);
	}

	function addAppointment(appointment: Omit<Appointment, 'id'>): void {
		const id = crypto.randomUUID();
		data.appointments = [...data.appointments, { ...appointment, id }];
		saveData(data);
	}

	function removeAppointment(id: string): void {
		data.appointments = data.appointments.filter((a) => a.id !== id);
		saveData(data);
	}

	// 0=Mon…6=Sun; JS getDay() returns 0=Sun…6=Sat → convert with (jsDay+6)%7
	const todayWeekday = $derived((): number => (new Date().getDay() + 6) % 7);

	const todaysMedicines = $derived((): Medicine[] => {
		const wd = todayWeekday();
		return data.medicines.filter(
			(m) => m.days === 'everyday' || (m.days as number[]).includes(wd)
		);
	});

	function addMedicine(medicine: Omit<Medicine, 'id'>): void {
		data.medicines = [...data.medicines, { ...medicine, id: crypto.randomUUID() }];
		saveData(data);
	}

	function removeMedicine(id: string): void {
		data.medicines = data.medicines.filter((m) => m.id !== id);
		saveData(data);
	}

	return {
		get cycleStartDate() {
			return data.cycleStartDate;
		},
		get cycleDay() {
			return cycleDay();
		},
		get currentPhase() {
			return currentPhase();
		},
		get cycleProgress() {
			return cycleProgress();
		},
		get todayLog() {
			return todayLog();
		},
		get upcomingAppointments() {
			return upcomingAppointments();
		},
		get activeWaterButtons() {
			return data.activeWaterButtons;
		},
		get recentHistory() {
			return recentHistory();
		},
		get activeWaterButtonDefs() {
			return activeWaterButtonDefs();
		},
		get waterGoalMl() {
			return data.waterGoalMl;
		},
		get cycleDays() {
			return CYCLE_DAYS;
		},
		get foods() {
			return data.foods;
		},
		get foodsDueToday() {
			return foodsDueToday();
		},
		addFood,
		removeFood,
		get daysSinceLastBowelMovement() {
			return daysSinceLastBowelMovement();
		},
		get allWaterButtons() {
			return allWaterButtons();
		},
		get phaseInfo() {
			return PHASE_STYLE;
		},
		getPhaseInfo,
		setCycleStartDate,
		updateWater,
		setWaterGoal,
		toggleWaterButton,
		toggleBowelMovement,
		addAppointment,
		removeAppointment,
		get medicines() {
			return data.medicines;
		},
		get todaysMedicines() {
			return todaysMedicines();
		},
		addMedicine,
		removeMedicine
	};
}

export const tracker = createTracker();
export { toDateString };
