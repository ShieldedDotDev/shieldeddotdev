import { AbstractBaseController } from "../AbstractController";

export class ErrorDialogController extends AbstractBaseController<HTMLDialogElement> {
	constructor() {
		super(document.createElement("dialog"), "error-dialog");
	}

	public show(message: string) {
		this.container.innerText = message;
		this.container.showModal();
	}
}
