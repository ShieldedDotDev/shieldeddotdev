import { render } from "preact";
import { useState } from "preact/hooks";

import { EnvInterface } from "../api/env";

interface ApiExampleGenerator {
	(env: EnvInterface, title: string, text: string, color: string, token: string): string;
}

interface ApiExamplesProps {
	env: EnvInterface;
	title?: string;
	text?: string;
	color?: string;
	token?: string;
}

const apiExamples: [string, ApiExampleGenerator][] = [
	["GitHub Action", gitHubActionExample],
	["Curl", curlExample],
	["JS", jsExample],
	["PHP", phpExample],
];

export function ApiExamples({ env, title = "Shielded.dev", text = "Rocks", color = "0011aa", token = "<secret>" }: ApiExamplesProps) {
	const [selectedExample, setSelectedExample] = useState(apiExamples[0]);
	const example = selectedExample[1](env, title, text, color, token);

	return <div class="api-example--controller">
		<ul>{apiExamples.map((item) => <li key={item[0]} class={item[0] === selectedExample[0] ? "selected" : ""} onClick={() => setSelectedExample(item)}>{item[0]}</li>)}</ul>
		<pre><code>{example}</code></pre>
	</div>;
}

export function mountApiExamples(elm: HTMLElement, env: EnvInterface) {
	render(<ApiExamples env={env} />, elm);
}

function curlExample(
	env: EnvInterface,
	title: string,
	text: string,
	color: string,
	token: string
) {
	return `curl -X "POST" "https://${env.ApiHost}" \\
	-H 'Authorization: token ${addslashesSingleQuotes(token)}' \\
	-H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \\
	--data-urlencode 'title=${addslashesSingleQuotes(title)}' \\
	--data-urlencode 'text=${addslashesSingleQuotes(text)}' \\
	--data-urlencode 'color=${addslashesSingleQuotes(color)}'`
}

function addslashesSingleQuotes(value: string) {
	return `${value}`.replace(/\\/g, "\\$&").replace(/'/g, "\\'");
}

function phpExample(
	env: EnvInterface,
	title: string,
	text: string,
	color: string,
	token: string
) {
	return `<?php

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_URL            => 'https://${env.ApiHost}',
	CURLOPT_POST           => true,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_POSTFIELDS     => [
		'title' => ${JSON.stringify(title)},
		'text'  => ${JSON.stringify(text)},
		'color' => ${JSON.stringify(color)},
	],
	CURLOPT_HTTPHEADER     => [
		${JSON.stringify("Authorization: token " + token)},
	],
]);

curl_exec($ch);
if( curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200 ) {
	//ok
}`
}

function jsExample(
	env: EnvInterface,
	title: string,
	text: string,
	color: string,
	token: string
) {
	return `const params = new URLSearchParams();

params.append('title', ${JSON.stringify(title)});
params.append('text', ${JSON.stringify(text)});
params.append('color', ${JSON.stringify(color)});

fetch('https://${env.ApiHost}', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': ${JSON.stringify("token " + token)},
	},
	body: params
})
.then((result) => {
	console.log('Success:', result);
})
.catch((error) => {
	console.error('Error:', error);
});`
}

function gitHubActionExample(
	_: EnvInterface,
	title: string,
	text: string,
	color: string,
	token: string
) {
	return `name: Update Shield
on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Update Shielded.dev Badge
        uses: shieldeddotdev/shielded-action@v1
        with:
          # The token should be stored as a repository secret
          shielded-token: ${JSON.stringify(token)}
          title: ${JSON.stringify(title)}
          text: ${JSON.stringify(text)}
          color: ${JSON.stringify(color)}`
}
