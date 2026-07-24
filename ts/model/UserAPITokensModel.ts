import { CreatedUserAPITokenInterface, UserAPITokenInterface, UserAPITokensApi } from "../api/tokens";
import { EventEmitter } from "../EventEmitter";

export class UserAPITokensModel {

	public readonly tokenEventEmitter = new EventEmitter<UserAPITokenInterface>();

	private tokens: UserAPITokenInterface[] = [];
	private loaded = false;

	public constructor(private tokensApi: UserAPITokensApi) { }

	public async getTokens() {
		if (!this.loaded) {
			this.tokens = await this.tokensApi.getTokens();
			this.loaded = true;
		}

		return this.tokens;
	}

	public async createToken(description: string): Promise<CreatedUserAPITokenInterface> {
		const created = await this.tokensApi.createToken(description);
		const token: UserAPITokenInterface = {
			APITokenID: created.APITokenID,
			UserID: created.UserID,
			Description: created.Description,
			Created: created.Created,
			LastUsed: created.LastUsed,
		};
		this.tokens.unshift(token);
		this.tokenEventEmitter.trigger(token);

		return created;
	}

	public async deleteToken(token: UserAPITokenInterface) {
		await this.tokensApi.deleteToken(token);
		this.tokens = this.tokens.filter((current) => current.APITokenID !== token.APITokenID);
		this.tokenEventEmitter.trigger(token);
	}

}
