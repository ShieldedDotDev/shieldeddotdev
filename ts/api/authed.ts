import { doRequest } from "./request";

export class AuthedApi {
	public async isAuthed() {
		try {
			await doRequest<{}>('api/authed', 'GET', null);

			return true;
		} catch (e) {
			return false;
		}
	}
}
