import { App, PluginSettingTab, Setting } from "obsidian";
import GymBroPlugin from "../main";

export class GymBroSettingTab extends PluginSettingTab {
	plugin: GymBroPlugin;

	constructor(app: App, plugin: GymBroPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Gym Log Settings" });

		for (const session in this.plugin.settings.sessions) {
			new Setting(containerEl)
				.setName(session)
				.setDesc(`Exercises in ${session}`)
				.addTextArea((textArea) => {
					textArea
						.setValue(
							this.plugin.settings.sessions[session].join("\n")
						)
						.onChange(async (value) => {
							this.plugin.settings.sessions[session] =
								value.split("\n");
							await this.plugin.saveSettings();
						});
				});
		}
	}
}
