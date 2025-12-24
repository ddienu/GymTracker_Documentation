// Constantes para los objetivos/metas disponibles
export const GOALS = {
    PERDER_PESO: 'PERDER_PESO',
    ENTRENAMIENTO_PERSONALIZADO: 'ENTRENAMIENTO_PERSONALIZADO', 
    GANAR_MASA_MUSCULAR: 'GANAR_MASA_MUSCULAR',
    AUMENTAR_RESISTENCIA: 'AUMENTAR_RESISTENCIA',
    BIENESTAR_GENERAL: 'BIENESTAR_GENERAL'
};

// Mapeo para mostrar nombres amigables
export const GOALS_DISPLAY = {
    [GOALS.PERDER_PESO]: 'Perder peso',
    [GOALS.ENTRENAMIENTO_PERSONALIZADO]: 'Entrenamiento personalizado',
    [GOALS.GANAR_MASA_MUSCULAR]: 'Ganar masa muscular', 
    [GOALS.AUMENTAR_RESISTENCIA]: 'Aumentar resistencia',
    [GOALS.BIENESTAR_GENERAL]: 'Bienestar general'
};

// Lista de opciones para el frontend
export const GOALS_OPTIONS = Object.keys(GOALS).map(key => ({
    value: GOALS[key],
    label: GOALS_DISPLAY[GOALS[key]],
    icon: getGoalIcon(GOALS[key])
}));

// Iconos para cada objetivo (basados en la imagen)
function getGoalIcon(goal) {
    const icons = {
        [GOALS.PERDER_PESO]: '⚖️',
        [GOALS.ENTRENAMIENTO_PERSONALIZADO]: '🦊', 
        [GOALS.GANAR_MASA_MUSCULAR]: '💪',
        [GOALS.AUMENTAR_RESISTENCIA]: '📈',
        [GOALS.BIENESTAR_GENERAL]: '🧘'
    };
    return icons[goal] || '🎯';
}

// Validar si un goal es válido
export function isValidGoal(goal) {
    return Object.values(GOALS).includes(goal);
}

// Obtener nombre amigable de un goal
export function getGoalDisplayName(goal) {
    return GOALS_DISPLAY[goal] || goal;
}