import { App, Modal } from 'obsidian';

export class GymBroModal extends Modal {
	sessions: string[];
	resolve: (value: string) => void;

	constructor(
		app: App,
		sessions: string[],
		resolve: (value: string) => void
	) {
		super(app);
		this.sessions = sessions;
		this.resolve = resolve;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: 'Select a Session' });

		this.sessions.forEach((session) => {
			const button = contentEl.createEl('button', { text: session });
			button.addEventListener('click', () => {
				this.resolve(session);
				this.close();
			});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
