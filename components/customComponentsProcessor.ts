import { App, MarkdownPostProcessorContext, TFile } from 'obsidian';
import { GymBroSettings } from '../settings';

export function customComponentsProcessor(
	app: App,
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
	session: string,
	settings: GymBroSettings
) {
	const container = document.createElement('div');

	// Création du select pour choisir un exercice
	const exerciseSelect = document.createElement('select');
	settings.sessions[session].forEach((exercise) => {
		const option = document.createElement('option');
		option.value = exercise;
		option.textContent = exercise;
		exerciseSelect.appendChild(option);
	});

	// Bouton pour ajouter un exercice
	const addButton = document.createElement('button');
	addButton.textContent = 'Add Exercise';
	addButton.classList.add('add-button');

	// Attacher l'événement au bouton pour ajouter l'exercice
	addButton.addEventListener('click', () => {
		// Ajouter un tableau ou une ligne au-dessus du conteneur de boutons
		addExerciseToMarkdown(
			ctx.sourcePath,
			app,
			exerciseSelect.value,
			container
		);
	});

	// On attache les éléments (le select et le bouton) au conteneur
	container.appendChild(exerciseSelect);
	container.appendChild(addButton);
	el.appendChild(container);

	// Charger et afficher les données existantes (le tableau)
	const file = ctx.sourcePath
		? app.vault.getAbstractFileByPath(ctx.sourcePath)
		: null;
	if (file instanceof TFile) {
		app.vault.read(file).then((content: string) => {
			const tables = parseTables(content);
			tables.forEach((table) => el.insertBefore(table, container)); // Afficher le tableau au-dessus des boutons
		});
	}

	// Fonction pour ajouter un exercice au Markdown
	function addExerciseToMarkdown(
		filePath: string,
		app: App,
		exercise: string,
		container: HTMLElement
	) {
		const file = app.vault.getAbstractFileByPath(filePath);
		if (file instanceof TFile) {
			app.vault.read(file).then((content: string) => {
				const tableRegex =
					/\| *Exercise *\| *Set *\| *Reps *\| *Weight *\| *Rest *\|\n\| *-+ *\| *-+ *\| *-+ *\| *-+ *\| *-+ *\|\n([\s\S]+?)(?=\n|$)/g;
				const match = tableRegex.exec(content);

				if (match) {
					// Si un tableau existe, ajouter une nouvelle ligne
					const newRow = `| ${exercise} | 0 | 0 | 0 | 0 |\n`;
					const updatedTable = match[0] + newRow;

					// Remplacer l'ancien tableau par celui mis à jour
					const updatedContent = content.replace(
						match[0],
						updatedTable
					);
					app.vault.modify(file, updatedContent).then(() => {
						console.log('New row added to existing table');

						// Actualiser la vue pour afficher le tableau mis à jour
						const updatedTables = parseTables(updatedContent);
						el.innerHTML = ''; // Vider l'élément pour le recharger
						updatedTables.forEach((table) =>
							el.insertBefore(table, container)
						); // Ajouter le tableau au-dessus des boutons
						el.appendChild(container); // Remettre les boutons en bas
					});
				} else {
					// Créer un nouveau tableau s'il n'existe pas
					const newTable = `
| Exercise | Set | Reps | Weight | Rest |
| --- | --- | --- | --- | --- |
| ${exercise} | 0 | 0 | 0 | 0 |
`;
					const updatedContent = content.trim() + '\n\n' + newTable;
					app.vault.modify(file, updatedContent).then(() => {
						console.log('New table created successfully');

						// Actualiser la vue pour afficher le nouveau tableau
						const updatedTables = parseTables(updatedContent);
						el.innerHTML = ''; // Vider l'élément pour le recharger
						updatedTables.forEach((table) =>
							el.insertBefore(table, container)
						); // Ajouter le tableau au-dessus des boutons
						el.appendChild(container); // Remettre les boutons en bas
					});
				}
			});
		} else {
			console.error('File not found or not a TFile');
		}
	}

	// Fonction pour parser le tableau
	function parseTables(content: string): HTMLElement[] {
		const tables: HTMLElement[] = [];
		const regex =
			/\| Exercise \| Set \| Reps \| Weight \| Rest \|\n\| --- \| --- \| --- \| --- \| --- \|\n([\s\S]+?)(?=\n|$)/g;
		let match: RegExpExecArray | null;
		while ((match = regex.exec(content)) !== null) {
			const tableHtml = `
			<table>
				<thead>
					<tr>
						<th>Exercise</th>
						<th>Set</th>
						<th>Reps</th>
						<th>Weight</th>
						<th>Rest</th>
					</tr>
				</thead>
				<tbody>
					${match[1]
						.trim()
						.split('\n')
						.map(
							(row) => `
						<tr>
							${row
								.split('|')
								.map((cell) => `<td>${cell.trim()}</td>`)
								.join('')}
						</tr>
					`
						)
						.join('')}
				</tbody>
			</table>
			`;
			const container = document.createElement('div');
			container.innerHTML = tableHtml;
			tables.push(container);
		}
		return tables;
	}
}
