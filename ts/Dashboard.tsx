import { render } from "preact";
import type { JSX } from "preact";
import { useEffect, useId, useRef, useState } from "preact/hooks";

import { AuthedApi } from "./api/authed";
import { EnvApi, EnvInterface } from "./api/env";
import { isRequestError } from "./api/request";
import { ShieldInterface, ShieldsApi } from "./api/shields";
import { CreatedUserAPITokenInterface, UserAPITokenInterface, UserAPITokensApi } from "./api/tokens";
import {
	ApiExampleGeneratorInterface,
	curlExample,
	gitHubActionExample,
	jsExample,
	phpExample,
} from "./Controllers/ApiExampleController";

type Page = "dashboard" | "user";

const shieldKeyPattern = /^[a-z0-9-]{5,64}$/;
const apiExamples: [string, ApiExampleGeneratorInterface][] = [
	["GitHub Action", gitHubActionExample],
	["Curl", curlExample],
	["JS", jsExample],
	["PHP", phpExample],
];

export async function Dashboard(elm: HTMLElement | null) {
	if (elm === null) {
		return;
	}

	const authApi = new AuthedApi();
	if (!await authApi.isAuthed()) {
		window.location.href = "/";
		return;
	}

	const env = await (new EnvApi()).getEnv();
	render(<DashboardApp env={env} />, elm);
}

function DashboardApp({ env }: { env: EnvInterface }) {
	const [page, setPage] = useState<Page>(currentPage());

	useEffect(() => {
		const updatePage = () => setPage(currentPage());
		window.addEventListener("hashchange", updatePage);
		return () => window.removeEventListener("hashchange", updatePage);
	}, []);

	return <>
		<DashboardNavigation page={page} />
		{page === "user" ? <>
			<h3>User tokens</h3>
			<div class="dashboard--controller"><APITokens /></div>
		</> : <>
			<h3>Dashboard</h3>
			<div class="dashboard--controller"><Shields env={env} /></div>
		</>}
	</>;
}

function DashboardNavigation({ page }: { page: Page }) {
	return <nav class="dashboard-navigation" aria-label="Dashboard navigation">
		<a href="#/dashboard" aria-current={page === "dashboard" ? "page" : undefined}>Shields</a>
		<a href="#/user" aria-current={page === "user" ? "page" : undefined}>User tokens</a>
	</nav>;
}

function Shields({ env }: { env: EnvInterface }) {
	const api = useRef(new ShieldsApi()).current;
	const [shields, setShields] = useState<ShieldInterface[] | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		void api.getShields()
			.then(setShields)
			.catch((requestError: unknown) => setError(errorMessage(requestError)));
	}, [api]);

	const createShield = async () => {
		setError("");
		try {
			const shield = await api.saveShield({
				Name: "New Shield",
				Title: "New",
				Color: "00AA55",
				Text: "Shield",
			});
			setShields((current) => [...(current || []), shield]);
			setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
		} catch (requestError) {
			setError(errorMessage(requestError));
		}
	};

	const saveShield = async (shield: ShieldInterface) => {
		setError("");
		try {
			const savedShield = await api.saveShield(shield);
			setShields((current) => (current || []).map((item) => item.ShieldID === savedShield.ShieldID ? savedShield : item));
		} catch (requestError) {
			setError(errorMessage(requestError));
			throw requestError;
		}
	};

	const deleteShield = async (shield: ShieldInterface) => {
		setError("");
		try {
			await api.deleteShield(shield);
			setShields((current) => (current || []).filter((item) => item.ShieldID !== shield.ShieldID));
		} catch (requestError) {
			setError(errorMessage(requestError));
		}
	};

	return <>
		<button type="button" class="add-button primary" onClick={createShield}><span class="icon">➕</span>New shield</button>
		{error !== "" && <p>{error}</p>}
		{shields === null && error === "" && <p>Loading shields…</p>}
		{shields !== null && shields.map((shield) => <ShieldForm key={shield.ShieldID} shield={shield} env={env} onSave={saveShield} onDelete={deleteShield} />)}
		{shields !== null && shields.length === 0 && <h4 class="no-shields">No shields yet. Click the button to get started.</h4>}
	</>;
}

interface ShieldFormProps {
	shield: ShieldInterface;
	env: EnvInterface;
	onSave(shield: ShieldInterface): Promise<void>;
	onDelete(shield: ShieldInterface): Promise<void>;
}

function ShieldForm({ shield, env, onSave, onDelete }: ShieldFormProps) {
	const [draft, setDraft] = useState<ShieldInterface>(shield);
	const draftRef = useRef(draft);
	const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [imageTick, setImageTick] = useState(Date.now());
	const [example, setExample] = useState(apiExamples[0]);
	const [markdownCopied, setMarkdownCopied] = useState(false);
	const [secretCopied, setSecretCopied] = useState(false);
	const [secretVisible, setSecretVisible] = useState(false);

	useEffect(() => () => {
		if (saveTimeout.current !== null) {
			clearTimeout(saveTimeout.current);
		}
	}, []);

	const queueSave = (next: ShieldInterface) => {
		if (saveTimeout.current !== null) {
			clearTimeout(saveTimeout.current);
			saveTimeout.current = null;
		}

		if (next.ShieldKey !== undefined && next.ShieldKey !== "" && !shieldKeyPattern.test(next.ShieldKey)) {
			return;
		}

		saveTimeout.current = setTimeout(() => {
			saveTimeout.current = null;
			void onSave(next)
				.then(() => setImageTick(Date.now()))
				.catch(() => undefined);
		}, 500);
	};

	const handleInput = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
		const input = event.target as HTMLInputElement;
		let next: ShieldInterface;
		switch (input.name) {
		case "Name":
		case "ShieldKey":
		case "Title":
		case "Text":
			next = { ...draftRef.current, [input.name]: input.value };
			break;
		case "Color":
			next = { ...draftRef.current, Color: input.value.replace(/^#/, "") };
			break;
		default:
			return;
		}

		draftRef.current = next;
		setDraft(next);
		queueSave(next);
	};

	const deleteShield = async () => {
		if (!confirm("Are you sure you want to delete this shield?")) {
			return;
		}
		if (saveTimeout.current !== null) {
			clearTimeout(saveTimeout.current);
		}
		await onDelete(draftRef.current);
	};

	const markdown = `![${draft.Name}](https://${env.ImgHost}/s/${draft.PublicID})`;
	const selectedExample = example[1](env, draft.Title, draft.Text, draft.Color, draft.Secret);
	const shieldKeyInvalid = draft.ShieldKey !== undefined && draft.ShieldKey !== "" && !shieldKeyPattern.test(draft.ShieldKey);
	const shieldKeyErrorID = `shield-${draft.ShieldID}-key-error`;
	const markdownInputID = `shield-${draft.ShieldID}-markdown`;
	const secretInputID = `shield-${draft.ShieldID}-secret`;

	return <form class="shield--controller" onInput={handleInput}>
		<section class="name-input">
			<Input label="Shield Name" name="Name" value={draft.Name} />
			<Input label="Shield key" name="ShieldKey" value={draft.ShieldKey || ""} pattern="[a-z0-9\\-]{5,64}" title="Optional: 5-64 lowercase letters, digits, or hyphens" placeholder="e.g. production-status" autoComplete="off" spellcheck={false} aria-invalid={shieldKeyInvalid} aria-describedby={shieldKeyInvalid ? shieldKeyErrorID : undefined} />
			{shieldKeyInvalid && <p id={shieldKeyErrorID} class="input-error" role="alert">Shield key must be 5-64 lowercase letters, digits, or hyphens.</p>}
		</section>
		<section class="shield-container"><img src={`https://${env.ImgHost}/s/${draft.PublicID}?break=${imageTick}`} alt={`${draft.Title}: ${draft.Text}`} /></section>
		<section class="main-inputs">
			<Input label="Title" name="Title" value={draft.Title} />
			<Input label="Text" name="Text" value={draft.Text} />
			<Input label="Color" name="Color" value={`#${draft.Color.replace(/^#/, "")}`} type="color" title="Must be a hex color code" />
		</section>
		<details class="api-example">
			<summary>API Call Examples</summary>
			<div class="api-example--controller">
				<ul>{apiExamples.map((item) => <li key={item[0]} class={item[0] === example[0] ? "selected" : ""} onClick={() => setExample(item)}>{item[0]}</li>)}</ul>
				<pre><code>{selectedExample}</code></pre>
			</div>
		</details>
		<section class="button-container"><button type="button" class="danger" onClick={deleteShield}><span class="icon">❌</span>Delete</button></section>
		<section class="fancy-inputs">
			<label for={markdownInputID}>Markdown</label>
			<div class="markdown-input--controller"><input id={markdownInputID} value={markdown} readOnly onClick={(event) => event.currentTarget.select()} /><button type="button" onClick={() => copy(markdown, setMarkdownCopied)}>{markdownCopied ? "Copied!" : "Copy"}</button></div>
			<label for={secretInputID}>This shield's API token</label>
			<div class="secret-input--controller"><input id={secretInputID} type={secretVisible ? "text" : "password"} value={draft.Secret} readOnly onClick={(event) => event.currentTarget.select()} /><button type="button" onClick={() => copy(draft.Secret, setSecretCopied)}>{secretCopied ? "Copied!" : "Copy"}</button><button type="button" onClick={() => setSecretVisible(!secretVisible)}>{secretVisible ? "Hide" : "Reveal"}</button></div>
		</section>
	</form>;
}

function Input({ label, ...attributes }: JSX.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
	const generatedID = useId();
	const id = attributes.id || generatedID;
	return <div class="input-container"><label for={id}>{label}</label><input {...attributes} id={id} /></div>;
}

function APITokens() {
	const api = useRef(new UserAPITokensApi()).current;
	const [tokens, setTokens] = useState<UserAPITokenInterface[] | null>(null);
	const [description, setDescription] = useState("");
	const [createdToken, setCreatedToken] = useState("");
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState("");
	const [creating, setCreating] = useState(false);

	useEffect(() => {
		void api.getTokens()
			.then(setTokens)
			.catch((requestError: unknown) => setError(errorMessage(requestError)));
	}, [api]);

	const createToken = async (event: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>) => {
		event.preventDefault();
		const trimmedDescription = description.trim();
		if (trimmedDescription === "") {
			setError("Description is required.");
			return;
		}

		setCreating(true);
		setError("");
		try {
			const token: CreatedUserAPITokenInterface = await api.createToken(trimmedDescription);
			setTokens((current) => [token, ...(current || [])]);
			setCreatedToken(token.Token);
			setDescription("");
			setCopied(false);
		} catch (requestError) {
			setError(errorMessage(requestError));
		} finally {
			setCreating(false);
		}
	};

	const revokeToken = async (token: UserAPITokenInterface) => {
		if (!confirm(`Revoke the token “${token.Description}”? This cannot be undone.`)) {
			return;
		}
		setError("");
		try {
			await api.deleteToken(token);
			setTokens((current) => (current || []).filter((item) => item.APITokenID !== token.APITokenID));
		} catch (requestError) {
			setError(errorMessage(requestError));
		}
	};

	return <section class="api-tokens--controller">
		<h3>User API tokens</h3>
		<p>Create a token to update or create any of your shields through the API.</p>
		<form onSubmit={createToken}>
			<label for="api-token-description">Description</label>
			<input id="api-token-description" name="description" value={description} onInput={(event) => setDescription(event.currentTarget.value)} required maxLength={255} placeholder="e.g. production deploy job" />
			<button type="submit" class="primary" disabled={creating}>Create token</button>
		</form>
		{error !== "" && <p>{error}</p>}
		{createdToken !== "" && <div class="created-api-token"><p>Copy this token now. It will not be shown again.</p><label for="created-api-token">New API token</label><input id="created-api-token" value={createdToken} readOnly onClick={(event) => event.currentTarget.select()} /><button type="button" onClick={() => copy(createdToken, setCopied)}>{copied ? "Copied!" : "Copy"}</button></div>}
		<div>
			<h4>Active tokens</h4>
			{tokens === null && error === "" && <p>Loading API tokens…</p>}
			{tokens !== null && tokens.length === 0 && <p>No API tokens yet.</p>}
			{tokens !== null && tokens.length > 0 && <table><thead><tr><th>Description</th><th>Created</th><th>Last used</th><th></th></tr></thead><tbody>{tokens.map((token) => <tr key={token.APITokenID}><td>{token.Description}</td><td>{formatTimestamp(token.Created)}</td><td>{token.LastUsed === null ? "Never" : formatTimestamp(token.LastUsed)}</td><td><button type="button" class="danger" onClick={() => revokeToken(token)}>Revoke</button></td></tr>)}</tbody></table>}
		</div>
	</section>;
}

function currentPage(): Page {
	return window.location.hash === "#/user" ? "user" : "dashboard";
}

function errorMessage(error: unknown) {
	return isRequestError(error) ? error.ctx.responseText : "Unable to complete that request.";
}

function formatTimestamp(value: string) {
	return new Date(value).toLocaleString();
}

async function copy(value: string, setCopied: (copied: boolean) => void) {
	try {
		await navigator.clipboard.writeText(value);
		setCopied(true);
	} catch (error) {
		console.error(error);
	}
}
