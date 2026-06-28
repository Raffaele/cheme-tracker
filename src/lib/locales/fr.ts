export default {
	app_name: 'Chemo Tracker',

	today: "Aujourd'hui",

	setup_title: 'Configurer votre cycle',
	setup_description: 'Entrez la date de début du cycle en cours pour commencer le suivi.',
	setup_start: 'Commencer',

	cycle_day_label: 'Jour du cycle',
	cycle_start: 'Début',
	cycle_end: 'Jour 28',
	cycle_inactive: 'Cycle terminé ou inactif',

	phase_1_label: 'Phase 1',
	phase_1_desc: 'Récupération',
	phase_2_label: 'Phase 2',
	phase_2_desc: 'Stabilisation',
	phase_3_label: 'Phase 3',
	phase_3_desc: 'Énergie croissante',
	phase_4_label: 'Phase 4',
	phase_4_desc: 'Pré-traitement',

	daily_log_title: "Enregistrement d'aujourd'hui",

	water_label: 'Eau',
	water_cups: 'verres',
	water_goal: 'objectif',
	water_config_aria: "Configurer les boutons d'eau",
	water_config_hint: 'Activez les boutons que vous souhaitez utiliser',
	water_no_buttons: "Aucun bouton actif — activez-en au moins un ⚙️",
	water_goal_label: 'Objectif journalier',
	water_goal_reached: 'Objectif atteint ! 🎉',
	water_add_aria: 'Ajouter',
	water_remove_aria: 'Retirer',

	btn_glass_label: 'Verre',
	btn_glass_short: '250 ml',
	btn_half_liter_label: 'Demi-litre',
	btn_half_liter_short: '500 ml',
	btn_liter_label: 'Litre',
	btn_liter_short: '1 L',
	btn_gallon_label: 'Gallon',
	btn_gallon_short: '3,785 L',

	bowel_label: 'Selles',
	bowel_hint: "Enregistrer l'événement du jour",

	appointments_title: 'Prochains rendez-vous',
	appointments_empty: 'Aucun rendez-vous programmé',
	appointments_add: '+ Ajouter',
	appointments_cancel: 'Annuler',
	appointments_title_input: 'Titre du rendez-vous',
	appointments_notes_input: 'Notes (facultatif)',
	appointments_save: 'Enregistrer le rendez-vous',
	appointments_remove_aria: 'Supprimer le rendez-vous',

	history_title: '30 derniers jours',

	food_title: 'Aliments à consommer',
	food_empty: 'Aucun aliment ajouté',
	food_add: '+ Ajouter',
	food_cancel: 'Annuler',
	food_name_input: 'Nom de l\'aliment',
	food_days_input: 'Jours avant expiration',
	food_save: 'Ajouter l\'aliment',
	food_remove_aria: 'Supprimer l\'aliment',
	food_expires: 'Avant le',
	food_alert_title: 'Aliments à consommer aujourd\'hui',

	bowel_alert_title: 'Attention',
	bowel_alert_msg: 'Aucune selle enregistrée depuis {days} jours.',

	install_btn: 'Installer l\'application',
	qr_title: 'Partager ou installer',
	qr_description: 'Scannez avec un autre appareil pour ouvrir l\'application'
} as const;
