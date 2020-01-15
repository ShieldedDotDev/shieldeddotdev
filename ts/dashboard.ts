import { DashboardController } from "./Controllers/DashboardController";

export async function Dashboard(elm: HTMLElement) {
	let dc = new DashboardController();
	dc.attach(elm);
}