import { AbstractBaseController } from "../AbstractController";
import { ShieldsModel } from "../model/ShieldsModel";
import { ShieldController } from "./ShieldController";

export class DashboardController extends AbstractBaseController {

	private addBtn = document.createElement('button');

	constructor(private model: ShieldsModel) {
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
			const sc = new ShieldController(shield, this.model);
			sc.attach(this.shieldsElm);
		}
	}

}
