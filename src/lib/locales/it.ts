export default {
	app_name: 'Chemo Tracker',

	// Header
	today: 'Oggi',

	// Setup
	setup_title: 'Configura il tuo ciclo',
	setup_description: 'Inserisci la data di inizio del ciclo corrente per iniziare il tracciamento.',
	setup_start: 'Inizia',

	// Cycle card
	cycle_day_label: 'Giorno del ciclo',
	cycle_start: 'Inizio',
	cycle_end: 'Giorno 28',
	cycle_inactive: 'Ciclo completato o non attivo',

	// Phases
	phase_1_label: 'Fase 1',
	phase_1_desc: 'Recupero',
	phase_2_label: 'Fase 2',
	phase_2_desc: 'Stabilizzazione',
	phase_3_label: 'Fase 3',
	phase_3_desc: 'Energia in crescita',
	phase_4_label: 'Fase 4',
	phase_4_desc: 'Pre-trattamento',

	// Daily log
	daily_log_title: 'Registrazione di oggi',

	// Water
	water_label: 'Acqua',
	water_cups: 'bicchieri',
	water_goal: 'obiettivo',
	water_config_aria: 'Configura bottoni acqua',
	water_config_hint: 'Attiva i bottoni che vuoi usare',
	water_no_buttons: 'Nessun bottone attivo — configura almeno uno ⚙️',
	water_goal_label: 'Obiettivo giornaliero',
	water_goal_reached: 'Obiettivo raggiunto! 🎉',
	water_add_aria: 'Aggiungi',
	water_remove_aria: 'Rimuovi',

	// Water button labels
	btn_glass_label: 'Bicchiere',
	btn_glass_short: '250 ml',
	btn_half_liter_label: 'Mezzo litro',
	btn_half_liter_short: '500 ml',
	btn_liter_label: 'Litro',
	btn_liter_short: '1 L',
	btn_gallon_label: 'Gallone',
	btn_gallon_short: '3.785 L',

	// Bowel movement
	bowel_label: 'Evacuazione',
	bowel_hint: "Registra l'evento del giorno",

	// Appointments
	appointments_title: 'Prossimi appuntamenti',
	appointments_empty: 'Nessun appuntamento in programma',
	appointments_add: '+ Aggiungi',
	appointments_cancel: 'Annulla',
	appointments_title_input: 'Titolo appuntamento',
	appointments_notes_input: 'Note (opzionale)',
	appointments_save: 'Salva appuntamento',
	appointments_remove_aria: 'Rimuovi appuntamento',

	// History
	history_title: 'Storico ultimi 30 giorni',

	// Install & QR
	install_btn: 'Installa app',
	qr_title: 'Condividi o installa',
	qr_description: 'Scansiona con un altro dispositivo per aprire l\'app'
} as const;
