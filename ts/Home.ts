import { EnvApi } from "./api/env";
import { ApiExampleController } from "./Controllers/ApiExampleController";
import { mountStaticBadgeGenerator } from "./components/StaticBadgeGenerator";

export async function Home(apiExampleElm : HTMLElement, staticBadgeGeneratorElm: HTMLElement) {
	const envApi = new EnvApi();
	const env = await envApi.getEnv();

	const apiExample = new ApiExampleController(env);
	apiExample.attach(apiExampleElm);

	mountStaticBadgeGenerator(staticBadgeGeneratorElm, env);
}
