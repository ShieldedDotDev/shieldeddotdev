import { UserAPITokensApi } from "./api/tokens";
import { UserAPITokensController } from "./Controllers/UserAPITokensController";
import { UserAPITokensModel } from "./model/UserAPITokensModel";

export function User(elm: HTMLElement) {
	const tokenSection = document.createElement('div');
	tokenSection.classList.add('dashboard--controller');
	elm.appendChild(tokenSection);

	const tokensApi = new UserAPITokensApi();
	const tokensModel = new UserAPITokensModel(tokensApi);
	(new UserAPITokensController(tokensModel)).attach(tokenSection);
}
