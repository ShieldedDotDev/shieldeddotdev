import { AbstractBaseController } from "../AbstractController";
import { ShieldInterface } from "../api/shields";
import { EventEmitter } from "../EventEmitter";

export class ShieldController extends AbstractBaseController {

	private nameInput = document.createElement('input');

	public shieldImg = document.createElement('img');

	public readonly events = new EventEmitter<'updated'>();

	constructor(public readonly shield: ShieldInterface) {
		super(document.createElement("div"), "shield");

		this.nameInput.value = shield.Name;

		this.container.appendChild(this.nameInput);

		this.nameInput.addEventListener('input', () => {
			shield.Name = this.nameInput.value;
			this.events.trigger('updated');
		});

		this.shieldImg.src = `https://img.shielded.dev/s/${shield.ShieldID}`;
		this.container.appendChild(this.shieldImg);
	}
}
