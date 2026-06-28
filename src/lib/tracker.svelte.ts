import type {
	TrackerData,
	DayLog,
	Appointment,
	CyclePhase,
	PhaseInfo,
	WaterButton,
	WaterButtonId
} from './types.js';

const STORAGE_KEY = 'chemo-tracker-data';
const DEFAULT_WATER_GOAL_ML = 2000;
const CYCLE_DAYS = 28;

const PHASE_INFO: Record<CyclePhase, PhaseInfo> = {
	1: {
		phase: 1,
		label: 'Fase 1',
		description: 'Recupero',
		colorClass: 'text-rose-600',
		bgClass: 'bg-rose-50 border-rose-200',
		days: [1, 4]
	},
	2: {
		phase: 2,
		label: 'Fase 2',
		description: 'Stabilizzazione',
		colorClass: 'text-amber-600',
		bgClass: 'bg-amber-50 border-amber-200',
		days: [5, 10]
	},
	3: {
		phase: 3,
		label: 'Fase 3',
		description: 'Energia in crescita',
		colorClass: 'text-emerald-600',
		bgClass: 'bg-emerald-50 border-emerald-200',
		days: [11, 17]
	},
	4: {
		phase: 4,
		label: 'Fase 4',
		description: 'Pre-trattamento',
		colorClass: 'text-blue-600',
		bgClass: 'bg-blue-50 border-blue-200',
		days: [18, 28]
	}
};

export const ALL_WATER_BUTTONS: WaterButton[] = [
	{ id: 'glass', label: 'Bicchiere', shortLabel: '250 ml', ml: 250, emoji: '🥛' },
	{ id: 'half_liter', label: 'Mezzo litro', shortLabel: '500 ml', ml: 500, emoji: '🍶' },
	{ id: 'liter', label: 'Litro', shortLabel: '1 L', ml: 1000, emoji: '🫙' },
	{ id: 'gallon', label: 'Gallone', shortLabel: '3.785 L', ml: 3785, emoji: '🪣' }
];

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
	if (typeof localStorage === 'undefined') {
		return {
			cycleStartDate: null,
			logs: {},
			appointments: [],
			activeWaterButtons: DEFAULT_WATER_BUTTONS,
			waterGoalMl: DEFAULT_WATER_GOAL_ML
		};
	}
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw)
		return {
			cycleStartDate: null,
			logs: {},
			appointments: [],
			activeWaterButtons: DEFAULT_WATER_BUTTONS,
			waterGoalMl: DEFAULT_WATER_GOAL_ML
		};
	try {
		const parsed = JSON.parse(raw) as TrackerData;
		if (!parsed.activeWaterButtons) parsed.activeWaterButtons = DEFAULT_WATER_BUTTONS;
		if (!parsed.waterGoalMl) parsed.waterGoalMl = DEFAULT_WATER_GOAL_ML;
		return parsed;
	} catch {
		return {
			cycleStartDate: null,
			logs: {},
			appointments: [],
			activeWaterButtons: DEFAULT_WATER_BUTTONS,
			waterGoalMl: DEFAULT_WATER_GOAL_ML
		};
	}
}

function saveData(data: TrackerData): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}
}

function createTracker() {
	let data = $state<TrackerData>(loadData());

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
		return PHASE_INFO[getPhaseForDay(day)];
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
		const days: DayLog[] = [];
		for (let i = 1; i <= 30; i++) {
			const d = new Date(todayString);
			d.setDate(d.getDate() - i);
			const dateStr = toDateString(d);
			if (data.logs[dateStr]) {
				days.push(data.logs[dateStr]);
			} else {
				days.push({ date: dateStr, waterMl: 0, isBowelMovementRecorded: false });
			}
		}
		return days;
	});

	const activeWaterButtonDefs = $derived((): WaterButton[] => {
		return ALL_WATER_BUTTONS.filter((b) => data.activeWaterButtons.includes(b.id));
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
			data.activeWaterButtons = ALL_WATER_BUTTONS.map((b) => b.id).filter(
				(b) => active.includes(b) || b === id
			);
		}
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
		get phaseInfo() {
			return PHASE_INFO;
		},
		setCycleStartDate,
		updateWater,
		setWaterGoal,
		toggleWaterButton,
		toggleBowelMovement,
		addAppointment,
		removeAppointment
	};
}

export const tracker = createTracker();
export { toDateString };
