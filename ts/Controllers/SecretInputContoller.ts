import { AbstractBaseController } from "../AbstractController";
import { ShieldInterface } from "../api/shields";

export class SecretInputController extends AbstractBaseController<HTMLDivElement> {

	private input = document.createElement('input');
	private secretCopyButton = document.createElement('button');
	private secretShowButton = document.createElement('button');

	constructor(shield: ShieldInterface) {
		super(document.createElement("div"), "secret-input");

		this.input.type = 'password';
		this.input.value = shield.Secret;
		this.input.readOnly = true;

		this.input.addEventListener('click', () => {
			this.input.select();
		});

		this.secretCopyButton.type = 'button';
		this.secretShowButton.type = 'button';

		this.secretCopyButton.innerText = '📋 Copy';
		this.secretShowButton.innerText = '👁️ Reveal';

		this.container.appendChild(this.input);
		this.container.appendChild(this.secretCopyButton);
		this.container.appendChild(this.secretShowButton);

		this.secretCopyButton.addEventListener('click', async () => {
			await navigator.clipboard.writeText(shield.Secret);
			this.secretCopyButton.innerText = '📋 Copied!';
		});

		this.secretShowButton.addEventListener('click', () => {
			if (this.input.type == 'password') {
				this.input.type = 'text';
				this.secretShowButton.innerText = '👁️ Hide';
			} else {
				this.input.type = 'password';
				this.secretShowButton.innerText = '👁️ Reveal';
			}
		});
	}
}
