import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

import { EnvInterface } from "../api/env";
import { CopyableInput } from "./CopyableInput";
import { Input } from "./Input";

interface StaticBadgeOptions {
	title: string;
	text: string;
	color: string;
}

const defaultOptions: StaticBadgeOptions = {
	title: "Build",
	text: "passing",
	color: "#00aa55",
};

export function StaticBadgeGenerator({ env }: { env: EnvInterface }) {
	const [options, setOptions] = useState(defaultOptions);
	const [previewOptions, setPreviewOptions] = useState(defaultOptions);

	useEffect(() => {
		const updateTimeout = window.setTimeout(() => setPreviewOptions(options), 400);
		return () => window.clearTimeout(updateTimeout);
	}, [options]);

	const badgeURL = staticBadgeURL(env, options);
	const previewURL = staticBadgeURL(env, previewOptions);
	const markdown = `![${markdownAlt(options.title)}](${badgeURL})`;

	return <div class="static-badge-generator--controller">
		<form onSubmit={(event) => event.preventDefault()}>
			<section class="main-inputs">
				<Input label="Title" name="title" value={options.title} onInput={(event) => setOptions((current) => ({ ...current, title: event.currentTarget.value }))} />
				<Input label="Text" name="text" value={options.text} onInput={(event) => setOptions((current) => ({ ...current, text: event.currentTarget.value }))} />
				<Input label="Color" name="color" type="color" value={options.color} title="Must be a hex color code" onInput={(event) => setOptions((current) => ({ ...current, color: event.currentTarget.value }))} />
			</section>
		</form>
		<section class="shield-container"><img src={previewURL} alt={[options.title, options.text].filter(Boolean).join(": ") || "Static badge"} /></section>
		<section class="fancy-inputs"><CopyableInput label="Markdown" value={markdown} /></section>
	</div>;
}

export function mountStaticBadgeGenerator(elm: HTMLElement, env: EnvInterface) {
	render(<StaticBadgeGenerator env={env} />, elm);
}

function staticBadgeURL(env: EnvInterface, options: StaticBadgeOptions) {
	const params = new URLSearchParams({
		title: options.title,
		text: options.text,
		color: options.color.replace(/^#/, ""),
	});
	return `https://${env.ImgHost}/s?${params}`;
}

function markdownAlt(title: string) {
	return (title || "Badge").replace(/[\\[\]]/g, "\\$&");
}
