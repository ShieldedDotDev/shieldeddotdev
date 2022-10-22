import { doRequest } from "./request";

export interface EnvInterface {
	RootHost: string
	ApiHost: string
	ImgHost: string
}

export class EnvApi {
	public getEnv() {
		return doRequest<EnvInterface>('env', 'GET', null);
	}
}
