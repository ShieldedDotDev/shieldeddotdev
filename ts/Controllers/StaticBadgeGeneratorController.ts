import { AbstractBaseController } from "../AbstractController";
import { EnvInterface } from "../api/env";

export class StaticBadgeGeneratorController extends AbstractBaseController {
	private titleInput: HTMLInputElement;
	private textInput: HTMLInputElement;
	private colorInput: HTMLInputElement;
	private preview: HTMLImageElement;
	private markdownInput: HTMLInputElement;
	private copyButton: HTMLButtonElement;
	private updateTimeout: number | null = null;

	constructor(private env: EnvInterface) {
		super(document.createElement("div"), "static-badge-generator");

		const form = document.createElement("form");
		form.addEventListener("submit", (event) => event.preventDefault());
		const inputs = document.createElement("section");
		inputs.classList.add("main-inputs");
		this.titleInput = this.addInput(inputs, "Title", "title", "text", "Build");
		this.textInput = this.addInput(inputs, "Text", "text", "text", "passing");
		this.colorInput = this.addInput(inputs, "Color", "color", "color", "#00aa55");
		this.colorInput.title = "Must be a hex color code";
		form.appendChild(inputs);

		const preview = document.createElement("section");
		preview.classList.add("shield-container");
		this.preview = document.createElement("img");
		preview.appendChild(this.preview);

		const markdown = document.createElement("section");
		markdown.classList.add("fancy-inputs");
		const markdownLabel = document.createElement("label");
		markdownLabel.htmlFor = "static-badge-generator-markdown";
		markdownLabel.textContent = "Markdown";
		const markdownInputContainer = document.createElement("div");
		markdownInputContainer.classList.add("markdown-input--controller");
		this.markdownInput = document.createElement("input");
		this.markdownInput.id = markdownLabel.htmlFor;
		this.markdownInput.readOnly = true;
		this.markdownInput.addEventListener("click", () => this.markdownInput.select());
		this.copyButton = document.createElement("button");
		this.copyButton.type = "button";
		this.copyButton.textContent = "Copy";
		this.copyButton.addEventListener("click", () => void this.copyMarkdown());
		markdownInputContainer.append(this.markdownInput, this.copyButton);
		markdown.append(markdownLabel, markdownInputContainer);

		this.container.append(form, preview, markdown);
		this.updatePreview();
	}

	private addInput(parent: HTMLElement, labelText: string, name: string, type: string, value: string): HTMLInputElement {
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
		parent.appendChild(container);

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
		this.markdownInput.value = `![${this.markdownAlt(title)}](${url})`;
		this.copyButton.textContent = "Copy";
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

	private async copyMarkdown() {
		try {
			await navigator.clipboard.writeText(this.markdownInput.value);
			this.copyButton.textContent = "Copied!";
		} catch (error) {
			console.error(error);
		}
	}
}
