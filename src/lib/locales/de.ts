export default {
	app_name: 'Chemo Tracker',

	today: 'Heute',

	setup_title: 'Zyklus einrichten',
	setup_description: 'Geben Sie das Startdatum des aktuellen Zyklus ein, um das Tracking zu beginnen.',
	setup_start: 'Starten',

	cycle_day_label: 'Zyklustag',
	cycle_start: 'Beginn',
	cycle_end: 'Tag 28',
	cycle_inactive: 'Zyklus abgeschlossen oder inaktiv',

	phase_1_label: 'Phase 1',
	phase_1_desc: 'Erholung',
	phase_2_label: 'Phase 2',
	phase_2_desc: 'Stabilisierung',
	phase_3_label: 'Phase 3',
	phase_3_desc: 'Steigende Energie',
	phase_4_label: 'Phase 4',
	phase_4_desc: 'Vorbehandlung',

	daily_log_title: 'Heutige Aufzeichnung',

	water_label: 'Wasser',
	water_cups: 'Gläser',
	water_goal: 'Ziel',
	water_config_aria: 'Wasserschaltflächen konfigurieren',
	water_config_hint: 'Aktiviere die Schaltflächen, die du verwenden möchtest',
	water_no_buttons: 'Keine aktiven Schaltflächen — aktiviere mindestens eine ⚙️',
	water_goal_label: 'Tagesziel',
	water_goal_reached: 'Ziel erreicht! 🎉',
	water_add_aria: 'Hinzufügen',
	water_remove_aria: 'Entfernen',

	btn_glass_label: 'Glas',
	btn_glass_short: '250 ml',
	btn_half_liter_label: 'Halber Liter',
	btn_half_liter_short: '500 ml',
	btn_liter_label: 'Liter',
	btn_liter_short: '1 L',
	btn_gallon_label: 'Gallone',
	btn_gallon_short: '3,785 L',

	bowel_label: 'Stuhlgang',
	bowel_hint: 'Das heutige Ereignis aufzeichnen',

	appointments_title: 'Bevorstehende Termine',
	appointments_empty: 'Keine Termine geplant',
	appointments_add: '+ Hinzufügen',
	appointments_cancel: 'Abbrechen',
	appointments_title_input: 'Terminbezeichnung',
	appointments_notes_input: 'Notizen (optional)',
	appointments_save: 'Termin speichern',
	appointments_remove_aria: 'Termin entfernen',

	history_title: 'Letzte 30 Tage',

	food_title: 'Zu verzehrende Lebensmittel',
	food_empty: 'Keine Lebensmittel hinzugefügt',
	food_add: '+ Hinzufügen',
	food_cancel: 'Abbrechen',
	food_name_input: 'Name des Lebensmittels',
	food_days_input: 'Tage bis zum Ablauf',
	food_save: 'Lebensmittel hinzufügen',
	food_remove_aria: 'Lebensmittel entfernen',
	food_expires: 'Bis zum',
	food_alert_title: 'Heute zu verzehrende Lebensmittel',

	bowel_alert_title: 'Achtung',
	bowel_alert_msg: 'Seit {days} Tagen kein Stuhlgang aufgezeichnet.',

	install_btn: 'App installieren',
	qr_title: 'Teilen oder installieren',
	qr_description: 'Mit einem anderen Gerät scannen, um die App zu öffnen'
} as const;
