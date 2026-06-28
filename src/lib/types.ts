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

export type WaterButtonId = 'glass' | 'half_liter' | 'liter' | 'gallon';

export interface WaterButton {
	id: WaterButtonId;
	label: string;
	shortLabel: string;
	ml: number;
	emoji: string;
}

export interface TrackerData {
	cycleStartDate: string | null;
	logs: Record<string, DayLog>;
	appointments: Appointment[];
	activeWaterButtons: WaterButtonId[];
	waterGoalMl: number;
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
