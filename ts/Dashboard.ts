import { AuthedApi } from "./api/authed";
import { EnvApi } from "./api/env";
import { ShieldsApi } from "./api/shields";
import { DashboardController } from "./Controllers/DashboardController";
import { ShieldImgRouter } from "./Controllers/ShieldController";
import { ShieldsModel } from "./model/ShieldsModel";
import { User } from "./User";

export async function Dashboard(elm: HTMLElement) {
	const authApi = new AuthedApi();
	if (!await authApi.isAuthed()) {
		window.location.href = '/';
		return;
	}

	const envApi = new EnvApi();
	const env = await envApi.getEnv();
	const imgr = new ShieldImgRouter(env);

	const sapi = new ShieldsApi();
	const sm = new ShieldsModel(sapi);
	const dc = new DashboardController(sm, env, imgr);
	const dashboardPage = document.createElement('article');
	const dashboardHeading = document.createElement('h3');
	dashboardHeading.innerText = 'Dashboard';
	dashboardPage.appendChild(dashboardHeading);
	dc.attach(dashboardPage);

	const userPage = document.createElement('article');
	const userHeading = document.createElement('h3');
	userHeading.innerText = 'User Settings';
	userPage.appendChild(userHeading);
	User(userPage);

	sm.shieldEventEmitter.add(() => {
		dc.render();
	});

	let activePage: HTMLElement | null = null;
	function renderPage() {
		const nextPage = window.location.hash === '#/user' ? userPage : dashboardPage;
		if (activePage === nextPage) {
			return;
		}

		if (activePage !== null) {
			elm.removeChild(activePage);
		}

		elm.appendChild(nextPage);
		activePage = nextPage;
	}

	window.addEventListener('hashchange', renderPage);
	renderPage();
}
