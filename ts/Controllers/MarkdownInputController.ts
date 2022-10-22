import { AbstractBaseController } from "../AbstractController";
import { ShieldInterface } from "../api/shields";
import { ShieldImgRouter } from "./ShieldController";

export class MarkdownInputController extends AbstractBaseController<HTMLDivElement> {

	private input = document.createElement('input');
	private secretCopyButton = document.createElement('button');

	constructor(shield: ShieldInterface, imgr: ShieldImgRouter) {
		super(document.createElement("div"), "markdown-input");

		this.input.value = imgr.shieldMarkdown(shield);
		this.input.readOnly = true;

		this.input.addEventListener('click', () => {
			this.input.select();
		});

		this.secretCopyButton.type = 'button';

		this.secretCopyButton.innerText = '📋 Copy';

		this.container.appendChild(this.input);
		this.container.appendChild(this.secretCopyButton);

		this.secretCopyButton.addEventListener('click', async () => {
			await navigator.clipboard.writeText(this.input.value);
			this.secretCopyButton.innerText = '📋 Copied!';
		});
	}

}
