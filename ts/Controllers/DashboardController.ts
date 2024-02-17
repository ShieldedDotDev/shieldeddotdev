import { AbstractBaseController } from "../AbstractController";
import { EnvInterface } from "../api/env";
import { isRequestError } from "../api/request";
import { ShieldsModel } from "../model/ShieldsModel";
import { ErrorDialogController } from "./ErrorDialogController";
import { ShieldController, ShieldImgRouter } from "./ShieldController";

export class DashboardController extends AbstractBaseController {

	private addBtn = document.createElement('button');
	private errDialog = new ErrorDialogController();

	constructor(private model: ShieldsModel, private env: EnvInterface, private imgr : ShieldImgRouter) {
		super(document.createElement('div'), 'dashboard');

		this.container.append(
			this.shieldsElm,
			this.addBtn,
		);

		document.body.appendChild(this.errDialog.getContainer());

		this.addBtn.innerText = 'Create new shield';
		this.addBtn.classList.add('add-button');

		this.addBtn.addEventListener('click', ()=> {
			this.model.newShield();
		});

		this.render();
	}

	private shieldsElm = document.createElement('div');

	public async render() {
		this.shieldsElm.innerHTML = '';

		let shields;
		try {
			shields = await this.model.getShields();
		}catch(e) {
			console.log(e)
			if(isRequestError(e)) {
				this.errDialog.show(e.ctx.responseText);
			}
			return;
		}

		for (const shield of shields) {
			const sc = new ShieldController(shield, this.model, this.env, this.imgr);
			sc.attach(this.shieldsElm);
		}

		if( shields.length === 0 ) {
			const msg = document.createElement('h4');
			msg.classList.add('no-shields');
			msg.innerText = 'No shields yet. Click the button to get started.';
			this.shieldsElm.appendChild(msg);
		}
	}

}
