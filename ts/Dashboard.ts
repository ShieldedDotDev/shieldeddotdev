import { AuthedApi } from "./api/authed";
import { ShieldsApi } from "./api/shields";
import { DashboardController } from "./Controllers/DashboardController";
import { ShieldsModel } from "./model/ShieldsModel";

export async function Dashboard(elm: HTMLElement) {
	const authApi = new AuthedApi();
	if (!await authApi.isAuthed()) {
		window.location.href = '/';
	}

	const sapi = new ShieldsApi();
	const sm = new ShieldsModel(sapi);
	const dc = new DashboardController(sm);
	dc.attach(elm);

	sm.shieldEventEmitter.add(() => {
		dc.render();
	});
}
