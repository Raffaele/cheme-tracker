export default {
	app_name: 'Chemo Tracker',

	today: 'Today',

	setup_title: 'Set up your cycle',
	setup_description: 'Enter the start date of the current cycle to begin tracking.',
	setup_start: 'Start',

	cycle_day_label: 'Cycle day',
	cycle_start: 'Start',
	cycle_end: 'Day 28',
	cycle_inactive: 'Cycle completed or inactive',

	phase_1_label: 'Phase 1',
	phase_1_desc: 'Recovery',
	phase_2_label: 'Phase 2',
	phase_2_desc: 'Stabilisation',
	phase_3_label: 'Phase 3',
	phase_3_desc: 'Rising energy',
	phase_4_label: 'Phase 4',
	phase_4_desc: 'Pre-treatment',

	daily_log_title: "Today's log",

	water_label: 'Water',
	water_cups: 'cups',
	water_goal: 'goal',
	water_config_aria: 'Configure water buttons',
	water_config_hint: 'Enable the buttons you want to use',
	water_no_buttons: 'No active buttons — enable at least one ⚙️',
	water_goal_label: 'Daily goal',
	water_goal_reached: 'Goal reached! 🎉',
	water_add_aria: 'Add',
	water_remove_aria: 'Remove',

	btn_glass_label: 'Glass',
	btn_glass_short: '250 ml',
	btn_half_liter_label: 'Half litre',
	btn_half_liter_short: '500 ml',
	btn_liter_label: 'Litre',
	btn_liter_short: '1 L',
	btn_gallon_label: 'Gallon',
	btn_gallon_short: '3.785 L',

	bowel_label: 'Bowel movement',
	bowel_hint: 'Record today\'s event',

	appointments_title: 'Upcoming appointments',
	appointments_empty: 'No appointments scheduled',
	appointments_add: '+ Add',
	appointments_cancel: 'Cancel',
	appointments_title_input: 'Appointment title',
	appointments_notes_input: 'Notes (optional)',
	appointments_save: 'Save appointment',
	appointments_remove_aria: 'Remove appointment',

	history_title: 'Last 30 days'
} as const;
