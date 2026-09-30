import { EnvApi } from "./api/env";
import { mountApiExamples } from "./components/ApiExamples";
import { mountStaticBadgeGenerator } from "./components/StaticBadgeGenerator";

export async function Home(apiExampleElm : HTMLElement, staticBadgeGeneratorElm: HTMLElement) {
	const envApi = new EnvApi();
	const env = await envApi.getEnv();

	mountApiExamples(apiExampleElm, env);
	mountStaticBadgeGenerator(staticBadgeGeneratorElm, env);
}
