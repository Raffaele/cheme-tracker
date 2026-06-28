export default {
	app_name: 'Chemo Tracker',

	today: 'Hoy',

	setup_title: 'Configura tu ciclo',
	setup_description: 'Introduce la fecha de inicio del ciclo actual para empezar el seguimiento.',
	setup_start: 'Empezar',

	cycle_day_label: 'Día del ciclo',
	cycle_start: 'Inicio',
	cycle_end: 'Día 28',
	cycle_inactive: 'Ciclo completado o inactivo',

	phase_1_label: 'Fase 1',
	phase_1_desc: 'Recuperación',
	phase_2_label: 'Fase 2',
	phase_2_desc: 'Estabilización',
	phase_3_label: 'Fase 3',
	phase_3_desc: 'Energía creciente',
	phase_4_label: 'Fase 4',
	phase_4_desc: 'Pretratamiento',

	daily_log_title: 'Registro de hoy',

	water_label: 'Agua',
	water_cups: 'vasos',
	water_goal: 'objetivo',
	water_config_aria: 'Configurar botones de agua',
	water_config_hint: 'Activa los botones que quieras usar',
	water_no_buttons: 'Ningún botón activo — activa al menos uno ⚙️',
	water_goal_label: 'Objetivo diario',
	water_goal_reached: '¡Objetivo alcanzado! 🎉',
	water_add_aria: 'Añadir',
	water_remove_aria: 'Quitar',

	btn_glass_label: 'Vaso',
	btn_glass_short: '250 ml',
	btn_half_liter_label: 'Medio litro',
	btn_half_liter_short: '500 ml',
	btn_liter_label: 'Litro',
	btn_liter_short: '1 L',
	btn_gallon_label: 'Galón',
	btn_gallon_short: '3,785 L',

	bowel_label: 'Deposición',
	bowel_hint: 'Registra el evento del día',

	appointments_title: 'Próximas citas',
	appointments_empty: 'No hay citas programadas',
	appointments_add: '+ Añadir',
	appointments_cancel: 'Cancelar',
	appointments_title_input: 'Título de la cita',
	appointments_notes_input: 'Notas (opcional)',
	appointments_save: 'Guardar cita',
	appointments_remove_aria: 'Eliminar cita',

	history_title: 'Últimos 30 días'
} as const;
