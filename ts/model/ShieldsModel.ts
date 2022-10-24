import { ShieldInterface, ShieldsApi } from "../api/shields";
import { EventEmitter } from "../EventEmitter";

export type ShieldActions = "created" | "deleted" | "changed" | "updating" | "updated" | "activated";

export interface ShieldEvent { shield: ShieldInterface; event: ShieldActions; }

export class ShieldsModel {

	public readonly shieldEventEmitter = new EventEmitter<ShieldEvent>();

	public constructor(private shieldsApi: ShieldsApi) { }

	private shields: ShieldInterface[] = [];

	public async getShields() {
		if (this.shields.length < 1) {
			this.shields = await this.shieldsApi.getShields();
		}

		return this.shields;
	}

	private timeouts: { [s: number]: { timeout: number, resolves: (() => void)[] } } = {};

	public async deleteShield(shield: ShieldInterface) {
		const shieldId = shield.ShieldID;
		if (!shieldId) {
			throw Error("Attempting to delete unpersisted shield");
		}

		await this.shieldsApi.deleteShield(shield);
		this.shields = this.shields.filter((n) => shield !== n);

		this.shieldEventEmitter.trigger({ shield, event: "deleted" });
	}

	public updateShield(shield: ShieldInterface, debounce: number = 100) {
		const shieldId = shield.ShieldID;
		if (!shieldId) {
			throw Error("Attempting to update unpersisted shield");
		}

		let updated = false;
		this.shields.map((n) => {
			if (n.ShieldID == shieldId) {
				updated = true;
				return shield;
			}

			return n;
		});

		if (!updated) {
			throw Error("Failed to update shield");
		}

		if (this.timeouts[shieldId]) {
			clearTimeout(this.timeouts[shieldId].timeout);
		}

		this.shieldEventEmitter.trigger({ shield, event: "changed" });

		return new Promise<void>((resolve) => {
			let resolves : (() => void)[] = [resolve];
			if(this.timeouts[shieldId]) {
				resolves = [...this.timeouts[shieldId].resolves, ...resolves];
			}

			this.timeouts[shieldId] = {
				timeout: setTimeout(async () => {
					this.shieldEventEmitter.trigger({ shield, event: "updating" });
					await this.shieldsApi.saveShield(shield);
					this.shieldEventEmitter.trigger({ shield, event: "updated" });

					for (const r of this.timeouts[shieldId].resolves) {
						r();
					}
					this.timeouts[shieldId].resolves = [];
				}, debounce),

				resolves,
			};
		});
	}

	public async newShield() {
		const shield = await this.shieldsApi.saveShield({
			Name: 'New Shield',
			Title: 'New',

			Text: 'Shield',
		});

		this.shields.push(shield);

		this.shieldEventEmitter.trigger({ shield, event: "created" });

		return shield;
	}

}
