import { ShieldInterface, ShieldsApi } from "../api/shields";
import { EventEmitter } from "../EventEmitter";

export type ShieldActions = "created" | "deleted" | "changed" | "deleted" | "updating" | "updated" | "activated";

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

	private timeouts: { [s: number]: { timeout: number, resolves: Array<() => void> } } = {};

	public updateShield(note: ShieldInterface, debounce: number = 2000) {
		const noteId = note.ShieldID;
		if (!noteId) {
			throw Error("Attempting to update unpersisted note");
		}

		let updated = false;
		this.shields.map((n) => {
			if (n.ShieldID == noteId) {
				updated = true;
				return note;
			}

			return n;
		});

		if (!updated) {
			throw Error("Failed to update note");
		}

		if (this.timeouts[noteId]) {
			clearTimeout(this.timeouts[noteId].timeout);
		}

		this.shieldEventEmitter.trigger({ shield: note, event: "changed" });

		return new Promise<void>((resolve) => {
			let resolves : Array<() => void> = [resolve];
			if(this.timeouts[noteId]) {
				resolves = [...this.timeouts[noteId].resolves, ...resolves];
			}

			this.timeouts[noteId] = {
				timeout: setTimeout(async () => {
					this.shieldEventEmitter.trigger({ shield: note, event: "updating" });
					await this.shieldsApi.saveShield(note);
					this.shieldEventEmitter.trigger({ shield: note, event: "updated" });

					for (const r of this.timeouts[noteId].resolves) {
						r();
					}
					this.timeouts[noteId].resolves = [];
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
