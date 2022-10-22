import { EnvApi } from "./api/env";
import { ApiExampleController } from "./Controllers/ApiExampleController";

export async function Home(apiExampleElm : HTMLElement) {
	const envApi = new EnvApi();
	const env = await envApi.getEnv();

	const apiExample = new ApiExampleController(env);
	apiExample.attach(apiExampleElm);
}