import { AbstractBaseController } from "../AbstractController";
import { ShieldsModel } from "../model/ShieldsModel";
import { ShieldController } from "./ShieldController";

export class DashboardController extends AbstractBaseController {

	private addBtn = document.createElement('button');

	constructor(private model: ShieldsModel) {
		super(document.createElement('div'), 'dashboard');

		this.container.appendChild(this.shieldsElm);

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
			const sc = new ShieldController(shield);

			sc.attach(this.shieldsElm);

			sc.events.add((e) => {
				switch(e) {
					case "updated":
						this.model.updateShield(sc.shield);
						break;
					case "deleted":
						this.model.deleteShield(sc.shield);
				}

			});
		}
	}

}
