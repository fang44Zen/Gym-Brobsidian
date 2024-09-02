import { Plugin, moment, Notice, TFile } from 'obsidian';
import { GymBroSettingTab } from './components/SettingTab';
import { GymBroNoteCreator } from './components/GymBroNoteCreator';
import { GymBroModal } from './components/GymBroModal';
import { customComponentsProcessor } from './components/customComponentsProcessor';
import { DEFAULT_SETTINGS, GymBroSettings } from './settings';

export default class GymBrObsidian extends Plugin {
	settings: GymBroSettings;

	async onload() {
		console.log('Loading Gym Log Plugin');

		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor(
			'custom-components',
			(source, el, ctx) => {
				customComponentsProcessor(
					this.app,
					source,
					el,
					ctx,
					session,
					this.settings
				);
			}
		);

		this.addRibbonIcon('dumbbell', 'Open Gym Log', () => {
			this.openGymLog();
		});

		this.addSettingTab(new GymBroSettingTab(this.app, this));
	}

	onunload() {
		console.log('Unloading Gym Log Plugin');
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async openGymLog() {
		const sessions = Object.keys(this.settings.sessions);
		await moment().format('YYYY-MM-DD');

		const session = await new Promise<string>((resolve) => {
			const modal = new GymBroModal(this.app, sessions, resolve);
			modal.open();
		});

		const noteCreator = new GymBroNoteCreator(
			this.app,
			this.settings,
			session
		);
		const file = await noteCreator.createNote();

		if (file instanceof TFile) {
			this.registerMarkdownCodeBlockProcessor(
				'custom-components',
				(source, el, ctx) => {
					customComponentsProcessor(
						this.app,
						source,
						el,
						ctx,
						session,
						this.settings
					);
				}
			);
			await this.app.workspace.getLeaf(true).openFile(file);
			new Notice('Gym log created.');
		} else {
			new Notice('Failed to create gym log note.');
		}
	}
}
