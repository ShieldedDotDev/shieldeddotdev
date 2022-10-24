import { AbstractBaseController } from "../AbstractController";
import { EnvInterface } from "../api/env";
import { ShieldsModel } from "../model/ShieldsModel";
import { ShieldController, ShieldImgRouter } from "./ShieldController";

export class DashboardController extends AbstractBaseController {

	private addBtn = document.createElement('button');

	constructor(private model: ShieldsModel, private env: EnvInterface, private imgr : ShieldImgRouter) {
		super(document.createElement('div'), 'dashboard');

		this.container.appendChild(this.shieldsElm);

		this.addBtn.title = 'Create new shield';
		this.addBtn.innerText = '+';
		this.addBtn.classList.add('add-button');
		this.container.appendChild(this.addBtn);
		this.addBtn.addEventListener('click', ()=> {
			this.model.newShield();
		});

		this.render();
	}

	private shieldsElm = document.createElement('div');

	public async render() {
		this.shieldsElm.innerHTML = '';

		const shields = await this.model.getShields();
		for (const shield of shields) {
			const sc = new ShieldController(shield, this.model, this.env, this.imgr);
			sc.attach(this.shieldsElm);
		}

		if( shields.length === 0 ) {
			const msg = document.createElement('h4');
			msg.classList.add('no-shields');
			msg.innerText = 'No shields yet. Click the + button to get started.';
			this.shieldsElm.appendChild(msg);
		}
	}

}
