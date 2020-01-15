import { AbstractBaseController } from "../AbstractController";

export class DashboardController extends AbstractBaseController {

	constructor(){
		super(document.createElement('div'), 'dashboard');

		console.log("x")
	}

}