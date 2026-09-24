import { EnvApi } from "./api/env";
import { ApiExampleController } from "./Controllers/ApiExampleController";
import { StaticBadgeGeneratorController } from "./Controllers/StaticBadgeGeneratorController";

export async function Home(apiExampleElm : HTMLElement, staticBadgeGeneratorElm: HTMLElement) {
	const envApi = new EnvApi();
	const env = await envApi.getEnv();

	const apiExample = new ApiExampleController(env);
	apiExample.attach(apiExampleElm);

	const staticBadgeGenerator = new StaticBadgeGeneratorController(env);
	staticBadgeGenerator.attach(staticBadgeGeneratorElm);
}
