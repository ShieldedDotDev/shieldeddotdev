import { AbstractBaseController } from "../AbstractController";
import { EnvInterface } from "../api/env";

export class StaticBadgeGeneratorController extends AbstractBaseController {
	private titleInput: HTMLInputElement;
	private textInput: HTMLInputElement;
	private colorInput: HTMLInputElement;
	private preview: HTMLImageElement;
	private markdown: HTMLElement;
	private updateTimeout: number | null = null;

	constructor(private env: EnvInterface) {
		super(document.createElement("div"), "static-badge-generator");

		const form = document.createElement("form");
		form.addEventListener("submit", (event) => event.preventDefault());
		this.titleInput = this.addInput(form, "Title", "title", "text", "Build");
		this.textInput = this.addInput(form, "Text", "text", "text", "passing");
		this.colorInput = this.addInput(form, "Color", "color", "color", "#00aa55");

		const preview = document.createElement("div");
		preview.classList.add("preview");
		this.preview = document.createElement("img");
		preview.appendChild(this.preview);

		const markdown = document.createElement("div");
		markdown.classList.add("markdown");
		const markdownTitle = document.createElement("h4");
		markdownTitle.textContent = "Markdown";
		const pre = document.createElement("pre");
		this.markdown = document.createElement("code");
		pre.appendChild(this.markdown);
		markdown.append(markdownTitle, pre);

		this.container.append(form, preview, markdown);
		this.updatePreview();
	}

	private addInput(form: HTMLFormElement, labelText: string, name: string, type: string, value: string): HTMLInputElement {
		const container = document.createElement("div");
		container.classList.add("input-container");

		const input = document.createElement("input");
		input.id = `static-badge-generator-${name}`;
		input.name = name;
		input.type = type;
		input.value = value;
		input.addEventListener("input", () => this.schedulePreview());

		const label = document.createElement("label");
		label.htmlFor = input.id;
		label.textContent = labelText;

		container.append(label, input);
		form.appendChild(container);

		return input;
	}

	private schedulePreview() {
		if (this.updateTimeout !== null) {
			window.clearTimeout(this.updateTimeout);
		}

		this.updateTimeout = window.setTimeout(() => {
			this.updateTimeout = null;
			this.updatePreview();
		}, 400);
	}

	private updatePreview() {
		const title = this.titleInput.value;
		const text = this.textInput.value;
		const url = this.staticBadgeURL();

		this.preview.src = url;
		this.preview.alt = [title, text].filter(Boolean).join(": ") || "Static badge";
		this.markdown.textContent = `![${this.markdownAlt(title)}](${url})`;
	}

	private staticBadgeURL() {
		const params = new URLSearchParams({
			title: this.titleInput.value,
			text: this.textInput.value,
			color: this.colorInput.value,
		});

		return `https://${this.env.ImgHost}/s?${params}`;
	}

	private markdownAlt(title: string) {
		return (title || "Badge").replace(/[\\[\]]/g, "\\$&");
	}
}
