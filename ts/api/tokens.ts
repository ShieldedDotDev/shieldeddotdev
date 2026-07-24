import { doRawRequest, doRequest } from "./request";

export interface UserAPITokenInterface {
	APITokenID: number;
	UserID: number;
	Description: string;
	Created: string;
	LastUsed: string | null;
}

export interface CreatedUserAPITokenInterface extends UserAPITokenInterface {
	Token: string;
}

export class UserAPITokensApi {
	public getTokens() {
		return doRequest<UserAPITokenInterface[]>('api/tokens', 'GET', null);
	}

	public createToken(description: string) {
		return doRequest<CreatedUserAPITokenInterface>('api/tokens', 'POST', JSON.stringify({ Description: description }));
	}

	public deleteToken(token: UserAPITokenInterface) {
		return doRawRequest(`api/token/${token.APITokenID}`, 'DELETE', null);
	}
}
