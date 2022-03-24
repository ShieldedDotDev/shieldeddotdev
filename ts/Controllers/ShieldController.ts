import { AbstractBaseController } from "../AbstractController";
import { ShieldInterface } from "../api/shields";
import { EventEmitter } from "../EventEmitter";

export class ShieldController extends AbstractBaseController {

	private nameInput = document.createElement('input');

	private shieldImg = document.createElement('img');

	private updateBtn = document.createElement('button');

	private deleteBtn = document.createElement('button');

	public readonly events = new EventEmitter<'updated'|'deleted'>();

	constructor(public readonly shield: ShieldInterface) {
		super(document.createElement("div"), "shield");

		this.nameInput.value = shield.Name;

		this.container.appendChild(this.nameInput);

		this.nameInput.addEventListener('input', () => {
			shield.Name = this.nameInput.value;
		});

		this.shieldImg.src = `https://img.local.shielded.dev/s/${shield.ShieldID}`;
		this.container.appendChild(this.shieldImg);

		this.container.appendChild(this.updateBtn);
		this.updateBtn.addEventListener('click', () => {
			this.events.trigger('updated');
		});

		this.deleteBtn.innerText = 'Delete';
		this.container.appendChild(this.deleteBtn);
		this.deleteBtn.addEventListener('click', () => {
			if( confirm('Are you sure you want to delete this shield?') ) {
				this.events.trigger('deleted');
			}
		});
	}
}

export function ShieldURL(shield: ShieldInterface) {
	return `https://img.shielded.dev/s/${shield.ShieldID}`;
}

export function ShieldMarkdown(shield: ShieldInterface) {
	return `![${shield.Name}](${ShieldURL(shield)})`;
}
