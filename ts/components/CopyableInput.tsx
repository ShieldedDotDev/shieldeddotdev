import { useEffect, useId, useState } from "preact/hooks";

interface CopyableInputProps {
	label: string;
	value: string;
	id?: string;
}

export function CopyableInput({ label, value, id: suppliedID }: CopyableInputProps) {
	const generatedID = useId();
	const id = suppliedID || generatedID;
	const [copied, setCopied] = useState(false);

	useEffect(() => setCopied(false), [value]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
		} catch (error) {
			console.error(error);
		}
	};

	return <>
		<label for={id}>{label}</label>
		<div class="markdown-input--controller"><input id={id} value={value} readOnly onClick={(event) => event.currentTarget.select()} /><button type="button" onClick={copy}>{copied ? "Copied!" : "Copy"}</button></div>
	</>;
}
