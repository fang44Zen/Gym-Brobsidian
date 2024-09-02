import { App, moment, TFile } from 'obsidian';
import { GymBroSettings } from '../settings';

export class GymBroNoteCreator {
	app: App;
	settings: GymBroSettings;
	session: string;

	constructor(app: App, settings: GymBroSettings, session: string) {
		this.app = app;
		this.settings = settings;
		this.session = session;
	}

	async createNote(): Promise<TFile | null> {
		const today = moment().format('YYYY-MM-DD');
		const noteTitle = `${this.session} - ${today}`;

		try {
			const file = await this.app.vault.create(
				`${noteTitle}.md`,
				this.getInitialContent()
			);
			await this.app.workspace.getLeaf(true).openFile(file);
			return file;
		} catch (error) {
			console.error('Failed to create note:', error);
			return null;
		}
	}

	getInitialContent(): string {
		const exercises = this.settings.sessions[this.session];
		return `
# ${this.session} - ${moment().format('YYYY-MM-DD')}

## Exercises

${exercises.map((exercise) => `- ${exercise}`).join('\n')}

\`\`\`custom-components
\`\`\`
    `;
	}
}
