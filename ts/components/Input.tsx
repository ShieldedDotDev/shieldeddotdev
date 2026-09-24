import type { JSX } from "preact";
import { useId } from "preact/hooks";

export function Input({ label, ...attributes }: JSX.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
	const generatedID = useId();
	const id = attributes.id || generatedID;
	return <div class="input-container"><label for={id}>{label}</label><input {...attributes} id={id} /></div>;
}
