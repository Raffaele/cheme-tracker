export interface DayLog {
	date: string; // YYYY-MM-DD
	waterMl: number;
	isBowelMovementRecorded: boolean;
}

export interface Appointment {
	id: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:MM
	title: string;
	notes?: string;
}

export type WaterButtonId = 'glass' | 'half_liter' | 'liter' | 'pint';

export interface WaterButton {
	id: WaterButtonId;
	label: string;
	shortLabel: string;
	ml: number;
	emoji: string;
}

export interface FoodItem {
	id: string;
	name: string;
	consumeBy: string; // YYYY-MM-DD
}

// days: 'everyday' | number[] where 0=Mon…6=Sun
export interface Medicine {
	id: string;
	name: string;
	days: 'everyday' | number[];
	times: string[]; // HH:MM
	// key = scheduled HH:MM → { date: YYYY-MM-DD, takenAt: HH:MM }
	takenLog?: Record<string, { date: string; takenAt: string }>;
}

export interface TrackerData {
	cycleStartDate: string | null;
	logs: Record<string, DayLog>;
	appointments: Appointment[];
	activeWaterButtons: WaterButtonId[];
	waterGoalMl: number;
	foods: FoodItem[];
	medicines: Medicine[];
}

export type CyclePhase = 1 | 2 | 3 | 4;

export interface PhaseInfo {
	phase: CyclePhase;
	label: string;
	description: string;
	colorClass: string;
	bgClass: string;
	days: [number, number];
}
