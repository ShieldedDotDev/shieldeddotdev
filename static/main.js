/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function isRequestError(e) {
    return e.ctx && e.event;
}
function doRequest(endpoint_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, method = 'GET', body = null, mods = () => { }) {
        const text = yield doRawRequest(endpoint, method, body, mods);
        return new Promise((resolve) => {
            const data = JSON.parse(text);
            resolve(data);
        });
    });
}
function doRawRequest(endpoint, method = 'GET', body = null, mods = () => { }) {
    const request = new XMLHttpRequest();
    request.open(method, `/${endpoint}`, true);
    mods(request);
    return new Promise((resolve, reject) => {
        request.addEventListener('load', function (e) {
            if (this.status >= 200 && this.status < 400) {
                resolve(this.responseText);
            }
            else {
                reject({ ctx: this, event: e });
            }
        });
        request.withCredentials = true;
        request.addEventListener('error', function (e) {
            reject({ ctx: this, event: e });
        });
        if (body) {
            request.send(body);
        }
        else {
            request.send();
        }
    });
}

class AuthedApi {
    isAuthed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield doRequest('api/authed', 'GET', null);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}

class EnvApi {
    getEnv() {
        return doRequest('env', 'GET', null);
    }
}

class ShieldsApi {
    getShields() {
        return doRequest('api/shields', 'GET', null);
    }
    saveShield(n) {
        if (n.ShieldID) {
            return doRequest(`api/shield/${n.ShieldID}`, 'PUT', JSON.stringify(n));
        }
        else {
            return doRequest('api/shields', 'POST', JSON.stringify(n));
        }
    }
    deleteShield(n) {
        return doRawRequest(`api/shield/${n.ShieldID}`, 'DELETE', JSON.stringify(n));
    }
}

class AbstractBaseController {
    constructor(container, name) {
        this.container = container;
        this.name = name;
        this.container.classList.add(`${this.name}--controller`);
    }
    attach(elm) {
        elm.appendChild(this.container);
    }
    detach(elm) {
        try {
            elm.removeChild(this.container);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    getContainer() {
        return this.container;
    }
    getName() {
        return this.name;
    }
}

class ErrorDialogController extends AbstractBaseController {
    constructor() {
        super(document.createElement("dialog"), "error-dialog");
    }
    show(message) {
        this.container.innerText = message;
        this.container.showModal();
    }
}

class ApiExampleController extends AbstractBaseController {
    constructor(env, shield = null) {
        super(document.createElement("div"), "api-example");
        this.env = env;
        this.shield = shield;
        this.preElm = document.createElement('pre');
        this.codeElm = document.createElement('code');
        this.examplesElm = document.createElement('ul');
        this.examples = [
            ['GitHub Action', gitHubActionExample, document.createElement('li')],
            ['Curl', curlExample, document.createElement('li')],
            ['JS', jsExample, document.createElement('li')],
            ['PHP', phpExample, document.createElement('li')],
        ];
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
    selectExample(example) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        for (const ex of this.examples) {
            ex[2].classList.remove('selected');
        }
        this.codeElm.textContent = example[1](this.env, (_b = (_a = this.shield) === null || _a === void 0 ? void 0 : _a.Title) !== null && _b !== void 0 ? _b : 'Shielded.dev', (_d = (_c = this.shield) === null || _c === void 0 ? void 0 : _c.Text) !== null && _d !== void 0 ? _d : 'Rocks', (_f = (_e = this.shield) === null || _e === void 0 ? void 0 : _e.Color) !== null && _f !== void 0 ? _f : '0011aa', (_h = (_g = this.shield) === null || _g === void 0 ? void 0 : _g.Secret) !== null && _h !== void 0 ? _h : '<secret>');
        example[2].classList.add('selected');
    }
}
function curlExample(env, title, text, color, token) {
    return `curl -X "POST" "https://${env.ApiHost}" \\
	-H 'Authorization: token ${addslashes_single_quotes(token)}' \\
	-H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \\
	--data-urlencode 'title=${addslashes_single_quotes(title)}' \\
	--data-urlencode 'text=${addslashes_single_quotes(text)}' \\
	--data-urlencode 'color=${addslashes_single_quotes(color)}'`;
}
function addslashes_single_quotes(str) {
    return `${str}`.replace(/\\/g, '\\$&').replace(/'/g, "\\'");
}
function phpExample(env, title, text, color, token) {
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
}`;
}
function jsExample(env, title, text, color, token) {
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
});`;
}
function gitHubActionExample(_, title, text, color, token) {
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
          color: ${JSON.stringify(color)}`;
}

class MarkdownInputController extends AbstractBaseController {
    constructor(shield, imgr) {
        super(document.createElement("div"), "markdown-input");
        this.input = document.createElement('input');
        this.secretCopyButton = document.createElement('button');
        this.input.value = imgr.shieldMarkdown(shield);
        this.input.readOnly = true;
        this.input.addEventListener('click', () => {
            this.input.select();
        });
        this.secretCopyButton.type = 'button';
        this.secretCopyButton.innerText = 'Copy';
        this.container.appendChild(this.input);
        this.container.appendChild(this.secretCopyButton);
        this.secretCopyButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield navigator.clipboard.writeText(this.input.value);
            this.secretCopyButton.innerText = 'Copied!';
        }));
    }
}

class SecretInputController extends AbstractBaseController {
    constructor(shield) {
        super(document.createElement("div"), "secret-input");
        this.input = document.createElement('input');
        this.secretCopyButton = document.createElement('button');
        this.secretShowButton = document.createElement('button');
        this.input.type = 'password';
        this.input.value = shield.Secret;
        this.input.readOnly = true;
        this.input.addEventListener('click', () => {
            this.input.select();
        });
        this.secretCopyButton.type = 'button';
        this.secretShowButton.type = 'button';
        this.secretCopyButton.innerText = 'Copy';
        this.secretShowButton.innerText = 'Reveal';
        this.container.appendChild(this.input);
        this.container.appendChild(this.secretCopyButton);
        this.container.appendChild(this.secretShowButton);
        this.secretCopyButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield navigator.clipboard.writeText(shield.Secret);
            this.secretCopyButton.innerText = 'Copied!';
        }));
        this.secretShowButton.addEventListener('click', () => {
            if (this.input.type == 'password') {
                this.input.type = 'text';
                this.secretShowButton.innerText = 'Hide';
            }
            else {
                this.input.type = 'password';
                this.secretShowButton.innerText = 'Reveal';
            }
        });
    }
}

class ShieldController extends AbstractBaseController {
    constructor(shield, model, env, imgr) {
        super(document.createElement("form"), "shield");
        this.shield = shield;
        this.imgr = imgr;
        this.nameInput = document.createElement('input');
        this.titleInput = document.createElement('input');
        this.textInput = document.createElement('input');
        this.colorInput = document.createElement('input');
        this.shieldImg = document.createElement('img');
        this.updateBtn = document.createElement('button');
        this.deleteBtn = document.createElement('button');
        this.updateBtn.type = 'button';
        this.deleteBtn.type = 'button';
        this.nameInput.value = shield.Name;
        this.titleInput.value = shield.Title;
        this.textInput.value = shield.Text;
        this.colorInput.value = '#' + shield.Color.replace(/^#/, '');
        this.colorInput.pattern = "^#?([0-9a-fA-F]{3}){1,2}$";
        this.colorInput.title = "Must be a hex color code";
        this.colorInput.type = "color";
        const nameInput = document.createElement('section');
        nameInput.classList.add('name-input');
        this.container.appendChild(nameInput);
        nameInput.appendChild(this.createInputContainer("Shield Name", this.nameInput));
        const shieldContainer = document.createElement('section');
        shieldContainer.appendChild(this.shieldImg);
        shieldContainer.classList.add('shield-container');
        this.container.appendChild(shieldContainer);
        const mainInputs = document.createElement('section');
        mainInputs.classList.add('main-inputs');
        this.container.appendChild(mainInputs);
        mainInputs.appendChild(this.createInputContainer("Title", this.titleInput));
        mainInputs.appendChild(this.createInputContainer("Text", this.textInput));
        mainInputs.appendChild(this.createInputContainer("Color", this.colorInput));
        const apiExample = document.createElement('details');
        apiExample.classList.add('api-example');
        this.container.appendChild(apiExample);
        function renderExample() {
            apiExample.innerHTML = '';
            const ec = new ApiExampleController(env, shield);
            const apiLabel = document.createElement('summary');
            apiLabel.innerText = 'API Call Examples';
            apiExample.appendChild(apiLabel);
            ec.attach(apiExample);
        }
        renderExample();
        this.container.addEventListener('input', () => {
            shield.Name = this.nameInput.value;
            shield.Title = this.titleInput.value;
            shield.Text = this.textInput.value;
            if (this.colorInput.value.startsWith('#')) {
                shield.Color = this.colorInput.value.substring(1);
            }
            else {
                shield.Color = this.colorInput.value;
            }
            renderExample();
        });
        const buttonContainer = document.createElement('section');
        buttonContainer.classList.add('button-container');
        this.container.appendChild(buttonContainer);
        this.updateBtn.innerText = 'Update';
        this.updateBtn.classList.add('primary');
        buttonContainer.appendChild(this.updateBtn);
        const saveIcon = document.createElement('span');
        saveIcon.classList.add('icon');
        saveIcon.innerText = '💾';
        this.updateBtn.prepend(saveIcon);
        this.updateBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            if (!this.container.checkValidity()) {
                this.container.reportValidity();
                return;
            }
            yield model.updateShield(shield);
        }));
        this.deleteBtn.classList.add('danger');
        this.deleteBtn.innerText = 'Delete';
        const xIcon = document.createElement('span');
        xIcon.classList.add('icon');
        xIcon.innerText = '❌';
        this.deleteBtn.prepend(xIcon);
        buttonContainer.appendChild(this.deleteBtn);
        this.deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this shield?')) {
                model.deleteShield(shield);
            }
        });
        const fancyInputs = document.createElement('section');
        fancyInputs.classList.add('fancy-inputs');
        this.container.appendChild(fancyInputs);
        const markdownLabel = document.createElement('label');
        markdownLabel.innerText = 'Markdown';
        fancyInputs.appendChild(markdownLabel);
        (new MarkdownInputController(shield, this.imgr)).attach(fancyInputs);
        const apiTokenLabel = document.createElement('label');
        apiTokenLabel.innerText = 'API Token';
        fancyInputs.appendChild(apiTokenLabel);
        (new SecretInputController(shield)).attach(fancyInputs);
        this.setImageWithCachebreaker();
    }
    createInputContainer(label, input) {
        const div = document.createElement('div');
        div.classList.add('input-container');
        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        div.appendChild(labelEl);
        div.appendChild(input);
        return div;
    }
    setImageWithCachebreaker() {
        const ts = (new Date()).getTime();
        this.shieldImg.src = `${this.imgr.shieldURL(this.shield)}?break=${ts}`;
    }
}
class ShieldImgRouter {
    constructor(env) {
        this.env = env;
    }
    shieldURL(shield) {
        return `https://${this.env.ImgHost}/s/${shield.PublicID}`;
    }
    shieldMarkdown(shield) {
        return `![${shield.Name}](${this.shieldURL(shield)})`;
    }
}

class DashboardController extends AbstractBaseController {
    constructor(model, env, imgr) {
        super(document.createElement('div'), 'dashboard');
        this.model = model;
        this.env = env;
        this.imgr = imgr;
        this.addBtn = document.createElement('button');
        this.errDialog = new ErrorDialogController();
        this.shieldsElm = document.createElement('div');
        this.container.append(this.addBtn, document.createElement('br'), this.shieldsElm);
        document.body.appendChild(this.errDialog.getContainer());
        this.addBtn.innerText = 'New shield';
        this.addBtn.classList.add('add-button');
        this.addBtn.classList.add('primary');
        const plusIcon = document.createElement('span');
        plusIcon.classList.add('icon');
        plusIcon.textContent = '➕';
        this.addBtn.prepend(plusIcon);
        this.addBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield this.model.newShield();
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        }));
        this.render();
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            this.shieldsElm.innerHTML = '';
            let shields;
            try {
                shields = yield this.model.getShields();
            }
            catch (e) {
                console.log(e);
                if (isRequestError(e)) {
                    this.errDialog.show(e.ctx.responseText);
                }
                return;
            }
            for (const shield of shields) {
                const sc = new ShieldController(shield, this.model, this.env, this.imgr);
                sc.attach(this.shieldsElm);
            }
            if (shields.length === 0) {
                const msg = document.createElement('h4');
                msg.classList.add('no-shields');
                msg.innerText = 'No shields yet. Click the button to get started.';
                this.shieldsElm.appendChild(msg);
            }
        });
    }
}

class EventEmitter {
    constructor() {
        this.listeners = new Set();
    }
    add(callback) {
        this.listeners.add(callback);
    }
    trigger(event) {
        this.listeners.forEach((fn) => fn(event));
    }
}

class ShieldsModel {
    constructor(shieldsApi) {
        this.shieldsApi = shieldsApi;
        this.shieldEventEmitter = new EventEmitter();
        this.shields = [];
        this.timeouts = {};
    }
    getShields() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.shields.length < 1) {
                this.shields = yield this.shieldsApi.getShields();
            }
            return this.shields;
        });
    }
    deleteShield(shield) {
        return __awaiter(this, void 0, void 0, function* () {
            const shieldId = shield.ShieldID;
            if (!shieldId) {
                throw Error("Attempting to delete unpersisted shield");
            }
            yield this.shieldsApi.deleteShield(shield);
            this.shields = this.shields.filter((n) => shield !== n);
            this.shieldEventEmitter.trigger({ shield, event: "deleted" });
        });
    }
    updateShield(shield, debounce = 100) {
        const shieldId = shield.ShieldID;
        if (!shieldId) {
            throw Error("Attempting to update unpersisted shield");
        }
        let updated = false;
        this.shields.map((n) => {
            if (n.ShieldID == shieldId) {
                updated = true;
                return shield;
            }
            return n;
        });
        if (!updated) {
            throw Error("Failed to update shield");
        }
        if (this.timeouts[shieldId]) {
            clearTimeout(this.timeouts[shieldId].timeout);
        }
        this.shieldEventEmitter.trigger({ shield, event: "changed" });
        return new Promise((resolve) => {
            let resolves = [resolve];
            if (this.timeouts[shieldId]) {
                resolves = [...this.timeouts[shieldId].resolves, ...resolves];
            }
            this.timeouts[shieldId] = {
                timeout: setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    this.shieldEventEmitter.trigger({ shield, event: "updating" });
                    yield this.shieldsApi.saveShield(shield);
                    this.shieldEventEmitter.trigger({ shield, event: "updated" });
                    for (const r of this.timeouts[shieldId].resolves) {
                        r();
                    }
                    this.timeouts[shieldId].resolves = [];
                }), debounce),
                resolves,
            };
        });
    }
    newShield() {
        return __awaiter(this, void 0, void 0, function* () {
            const shield = yield this.shieldsApi.saveShield({
                Name: 'New Shield',
                Title: 'New',
                Color: '00AA55',
                Text: 'Shield',
            });
            this.shields.push(shield);
            this.shieldEventEmitter.trigger({ shield, event: "created" });
            return shield;
        });
    }
}

function Dashboard(elm) {
    return __awaiter(this, void 0, void 0, function* () {
        const authApi = new AuthedApi();
        if (!(yield authApi.isAuthed())) {
            window.location.href = '/';
        }
        const envApi = new EnvApi();
        const env = yield envApi.getEnv();
        const imgr = new ShieldImgRouter(env);
        const sapi = new ShieldsApi();
        const sm = new ShieldsModel(sapi);
        const dc = new DashboardController(sm, env, imgr);
        dc.attach(elm);
        sm.shieldEventEmitter.add(() => {
            dc.render();
        });
    });
}

function Home(apiExampleElm) {
    return __awaiter(this, void 0, void 0, function* () {
        const envApi = new EnvApi();
        const env = yield envApi.getEnv();
        const apiExample = new ApiExampleController(env);
        apiExample.attach(apiExampleElm);
    });
}

export { Dashboard, Home };
