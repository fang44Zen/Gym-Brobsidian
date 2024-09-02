import { App, Modal } from "obsidian";
import { GymBroSettings } from "../settings";

export class ExerciseBroModal extends Modal {
	settings: GymBroSettings;
	session: string;

	constructor(app: App, settings: GymBroSettings, session: string) {
		super(app);
		this.settings = settings;
		this.session = session;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl("h2", { text: `Log for ${this.session}` });

		const exerciseSelect = contentEl.createEl("select");
		this.settings.sessions[this.session].forEach((exercise) => {
			const option = exerciseSelect.createEl("option", {
				text: exercise,
			});
			option.value = exercise;
		});

		const addButton = contentEl.createEl("button", {
			text: "Add Exercise",
		});
		addButton.addEventListener("click", () => {
			const selectedExercise = exerciseSelect.value;
			this.addExerciseTable(contentEl, selectedExercise);
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	addExerciseTable(contentEl: HTMLElement, exercise: string) {
		const table = contentEl.createEl("table");
		table.createEl("thead").createEl("tr", {}, (tr) => {
			tr.createEl("th", { text: "Exercise" });
			tr.createEl("th", { text: "Set" });
			tr.createEl("th", { text: "Reps" });
			tr.createEl("th", { text: "Weight" });
			tr.createEl("th", { text: "Rest" });
			tr.createEl("th", { text: "Actions" });
		});

		const tbody = table.createEl("tbody");
		this.addExerciseRow(tbody, exercise);
	}

	addExerciseRow(tbody: HTMLElement, exercise: string) {
		const tr = tbody.createEl("tr");
		tr.createEl("td", { text: exercise });
		tr.createEl("td").createEl("input", { type: "number" });
		tr.createEl("td").createEl("input", { type: "number" });
		tr.createEl("td").createEl("input", { type: "number" });
		tr.createEl("td").createEl("input", { type: "number" });
		const actionTd = tr.createEl("td");
		const addButton = actionTd.createEl("button", { text: "Add" });
		addButton.addEventListener("click", () => {
			this.addExerciseRow(tbody, exercise);
		});
	}
}
