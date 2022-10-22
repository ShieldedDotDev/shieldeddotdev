import { doRawRequest, doRequest } from "./request";

export interface ShieldInterface {
	ShieldID?: number;
	PublicID?: string;
	UserID: number;
	Name: string;
	Title: string;
	Text: string;
	Color: string;
	Secret: string;
}

export class ShieldsApi {
	public getShields() {
		return doRequest<ShieldInterface[]>('api/shields', 'GET', null);
	}

	public saveShield(n: Partial<ShieldInterface>) {
		if (n.ShieldID) {
			return doRequest<ShieldInterface>(`api/shield/${n.ShieldID}`, 'PUT', JSON.stringify(n));
		} else {
			return doRequest<ShieldInterface>('api/shields', 'POST', JSON.stringify(n));
		}
	}

	public deleteShield(n: ShieldInterface) {
		return doRawRequest(`api/shield/${n.ShieldID}`, 'DELETE', JSON.stringify(n));
	}
}
