import { AuthedApi } from "./api/authed";
import { EnvApi } from "./api/env";
import { ShieldsApi } from "./api/shields";
import { DashboardController } from "./Controllers/DashboardController";
import { ShieldImgRouter } from "./Controllers/ShieldController";
import { ShieldsModel } from "./model/ShieldsModel";

export async function Dashboard(elm: HTMLElement) {
	const authApi = new AuthedApi();
	if (!await authApi.isAuthed()) {
		window.location.href = '/';
	}

	const envApi = new EnvApi();
	const env = await envApi.getEnv();
	const imgr = new ShieldImgRouter(env);

	const sapi = new ShieldsApi();
	const sm = new ShieldsModel(sapi);
	const dc = new DashboardController(sm, env, imgr);
	dc.attach(elm);

	sm.shieldEventEmitter.add(() => {
		dc.render();
	});
}
