import { AbstractBaseController } from "../AbstractController";
import { ShieldInterface } from "../api/shields";
import { ShieldsModel } from "../model/ShieldsModel";
import { MarkdownInputController } from "./MarkdownInputController";
import { SecretInputController } from "./SecretInputContoller";

export class ShieldController extends AbstractBaseController<HTMLFormElement> {

	private nameInput = document.createElement('input');
	private titleInput = document.createElement('input');
	private textInput = document.createElement('input');
	private colorInput = document.createElement('input');

	private shieldImg = document.createElement('img');
	private updateBtn = document.createElement('button');
	private deleteBtn = document.createElement('button');

	constructor(public readonly shield: ShieldInterface, model: ShieldsModel) {
		super(document.createElement("form"), "shield");
		this.updateBtn.type = 'button';
		this.deleteBtn.type = 'button';

		this.nameInput.value = shield.Name;

		this.titleInput.value = shield.Title;
		this.textInput.value = shield.Text;
		this.colorInput.value = shield.Color;

		this.colorInput.pattern = "^#?([0-9a-fA-F]{3}){1,2}$";
		this.colorInput.title = "Must be a hex color code";

		const nameInput = document.createElement('section');
		nameInput.classList.add('name-input');
		this.container.appendChild(nameInput);

		nameInput.appendChild(this.createInputContainer("Name", this.nameInput));

		const shieldContainer = document.createElement('section');
		shieldContainer.appendChild(this.shieldImg);
		shieldContainer.classList.add('shield-container');
		this.container.appendChild(shieldContainer);

		const mainInputs = document.createElement('section');
		mainInputs.classList.add('main-inputs');
		this.container.appendChild(mainInputs);

		mainInputs.appendChild(this.createInputContainer("Title", this.titleInput));
		mainInputs.appendChild(this.createInputContainer("Text", this.textInput));
		mainInputs.appendChild(this.createInputContainer("Color", this.colorInput));

		this.container.addEventListener('input', () => {
			shield.Name = this.nameInput.value;
			shield.Title = this.titleInput.value;
			shield.Text = this.textInput.value;
			if (this.colorInput.value.startsWith('#')) {
				shield.Color = this.colorInput.value.substring(1);
			} else {
				shield.Color = this.colorInput.value;
			}
		});

		const buttonContainer = document.createElement('section');
		buttonContainer.classList.add('button-container');
		this.container.appendChild(buttonContainer);

		this.updateBtn.innerText = '💾 Update';
		buttonContainer.appendChild(this.updateBtn);
		this.updateBtn.addEventListener('click', async () => {
			if (!this.container.checkValidity()) {
				this.container.reportValidity();
				return;
			}

			await model.updateShield(shield);
		});

		this.deleteBtn.innerText = '❌ Delete';
		buttonContainer.appendChild(this.deleteBtn);
		this.deleteBtn.addEventListener('click', () => {
			if (confirm('Are you sure you want to delete this shield?')) {
				model.deleteShield(shield);
			}
		});

		const fancyInputs = document.createElement('section');
		fancyInputs.classList.add('fancy-inputs');
		this.container.appendChild(fancyInputs);

		const markdownLabel = document.createElement('label');
		markdownLabel.innerText = 'Markdown';
		fancyInputs.appendChild(markdownLabel);
		(new MarkdownInputController(shield)).attach(fancyInputs);

		const apiTokenLabel = document.createElement('label');
		apiTokenLabel.innerText = 'API Token';
		fancyInputs.appendChild(apiTokenLabel);
		(new SecretInputController(shield)).attach(fancyInputs);


		this.setImageWithCachebreaker();
	}

	private createInputContainer(label: string, input: HTMLInputElement) {
		const div = document.createElement('div');
		div.classList.add('input-container');
		const labelEl = document.createElement('label');
		labelEl.innerText = label;
		div.appendChild(labelEl);
		div.appendChild(input);

		return div;
	}

	private setImageWithCachebreaker() {
		const ts = (new Date()).getTime();
		this.shieldImg.src = `${ShieldURL(this.shield)}?break=${ts}`;
	}
}

export function ShieldURL(shield: ShieldInterface) {
	return `https://img.local.shielded.dev/s/${shield.ShieldID}`;
}

export function ShieldMarkdown(shield: ShieldInterface) {
	return `![${shield.Name}](${ShieldURL(shield)})`;
}
