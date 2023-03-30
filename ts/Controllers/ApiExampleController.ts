import { AbstractBaseController } from "../AbstractController";
import { EnvInterface } from "../api/env";
import { ShieldInterface } from "../api/shields";

export interface ApiExampleGeneratorInterface {
	(env: EnvInterface, title: string, text: string, color: string, token: string): string;
}

export class ApiExampleController extends AbstractBaseController {

	private preElm = document.createElement('pre');
	private codeElm = document.createElement('code');

	private examplesElm = document.createElement('ul');

	private examples: [string, ApiExampleGeneratorInterface, HTMLLIElement][] = [
		['GitHub Action', gitHubActionExample, document.createElement('li')],
		['Curl', curlExample, document.createElement('li')],
		['JS', jsExample, document.createElement('li')],
		['PHP', phpExample, document.createElement('li')],
	];

	constructor(private env: EnvInterface, private shield: ShieldInterface | null = null) {
		super(document.createElement("div"), "api-example");

		this.container.appendChild(this.examplesElm);

		for (const example of this.examples) {
			this.examplesElm.appendChild(example[2]);
			example[2].textContent = example[0];
			example[2].addEventListener('click', () => this.selectExample(example));
		}

		this.selectExample(this.examples[0]);

		this.container.appendChild(this.preElm);
		this.preElm.appendChild(this.codeElm);
	}

	private selectExample(example: [string, ApiExampleGeneratorInterface, HTMLLIElement]) {
		for (const ex of this.examples) {
			ex[2].classList.remove('selected');
		}
		this.codeElm.textContent = example[1](this.env, this.shield?.Title ?? 'Shielded.dev', this.shield?.Text ?? 'Rocks', this.shield?.Color ?? '0011aa', this.shield?.Secret ?? '<secret>');
		example[2].classList.add('selected');
	}

}

function curlExample(
	env: EnvInterface,
	title: string,
	text: string,
	color: string,
	token: string
) {
	return `curl -X "POST" "https://${env.ApiHost}" \\
	-H 'Authorization: token ${addslashes_single_quotes(token)}' \\
	-H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \\
	--data-urlencode 'title=${addslashes_single_quotes(title)}' \\
	--data-urlencode 'text=${addslashes_single_quotes(text)}' \\
	--data-urlencode 'color=${addslashes_single_quotes(color)}'`
}

function addslashes_single_quotes(str: string) {
	return `${str}`.replace(/\\/g, '\\$&').replace(/'/g, "\\'");
};

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
		${JSON.stringify('Authorization: token ' + token)},
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
		'Authorization': ${JSON.stringify('token ' + token)},
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
