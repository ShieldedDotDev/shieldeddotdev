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
			this.addBtn,
			document.createElement('br'),
			this.shieldsElm,
		);

		document.body.appendChild(this.errDialog.getContainer());

		this.addBtn.innerText = 'New shield';
		this.addBtn.classList.add('add-button');
		this.addBtn.classList.add('primary');

		const plusIcon = document.createElement('span');
		plusIcon.classList.add('icon');
		plusIcon.textContent = '➕';
		this.addBtn.prepend(plusIcon);

		this.addBtn.addEventListener('click', async ()=> {
			await this.model.newShield();
			setTimeout(() => {
				window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
			}, 100);
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
