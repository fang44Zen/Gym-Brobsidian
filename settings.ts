export interface GymBroSettings {
	sessions: { [key: string]: string[] }; // Catégories de séances avec une liste d'exercices
}

export const DEFAULT_SETTINGS: GymBroSettings = {
	sessions: {
		Push: ['Bench Press', 'Shoulder Press', 'Triceps Extension'],
		Pull: ['Pull Up', 'Row', 'Bicep Curl'],
		Leg: ['Squat', 'Deadlift', 'Leg Press'],
	},
};
