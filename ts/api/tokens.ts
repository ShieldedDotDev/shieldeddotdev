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
		return doRequest<UserAPITokenInterface[]>('api/user/tokens', 'GET', null);
	}

	public createToken(description: string) {
		return doRequest<CreatedUserAPITokenInterface>('api/user/tokens', 'POST', JSON.stringify({ Description: description }));
	}

	public deleteToken(token: UserAPITokenInterface) {
		return doRawRequest(`api/user/tokens/${token.APITokenID}`, 'DELETE', null);
	}
}
