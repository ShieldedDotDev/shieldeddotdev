import { AbstractBaseController } from "../AbstractController";
import { isRequestError } from "../api/request";
import { UserAPITokenInterface } from "../api/tokens";
import { UserAPITokensModel } from "../model/UserAPITokensModel";

export class UserAPITokensController extends AbstractBaseController {

	private readonly createForm = document.createElement('form');
	private readonly descriptionInput = document.createElement('input');
	private readonly createButton = document.createElement('button');
	private readonly messageElm = document.createElement('p');
	private readonly createdTokenElm = document.createElement('div');
	private readonly tokensElm = document.createElement('div');

	public constructor(private model: UserAPITokensModel) {
		super(document.createElement('section'), 'api-tokens');

		const heading = document.createElement('h3');
		heading.textContent = 'API Tokens';
		const explanation = document.createElement('p');
		explanation.textContent = 'Create a token for a future API. Tokens do not grant access to the current shield update API.';

		const descriptionLabel = document.createElement('label');
		descriptionLabel.htmlFor = 'api-token-description';
		descriptionLabel.textContent = 'Description';
		this.descriptionInput.id = 'api-token-description';
		this.descriptionInput.name = 'description';
		this.descriptionInput.required = true;
		this.descriptionInput.maxLength = 255;
		this.descriptionInput.placeholder = 'e.g. production deploy job';

		this.createButton.type = 'submit';
		this.createButton.textContent = 'Create token';
		this.createButton.classList.add('primary');

		this.createForm.append(descriptionLabel, this.descriptionInput, this.createButton);
		this.container.append(heading, explanation, this.createForm, this.messageElm, this.createdTokenElm, this.tokensElm);

		this.createForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			await this.createToken();
		});

		this.model.tokenEventEmitter.add(() => {
			this.render();
		});
		this.render();
	}

	private async createToken() {
		const description = this.descriptionInput.value.trim();
		this.descriptionInput.setCustomValidity('');
		if (description === '') {
			this.descriptionInput.setCustomValidity('Description is required.');
			this.descriptionInput.reportValidity();
			return;
		}

		this.createButton.disabled = true;
		this.setMessage('');
		try {
			const token = await this.model.createToken(description);
			this.createForm.reset();
			this.showCreatedToken(token.Token);
		} catch (error) {
			this.setMessage(this.errorMessage(error));
		} finally {
			this.createButton.disabled = false;
		}
	}

	private async render() {
		this.tokensElm.innerHTML = '';

		let tokens: UserAPITokenInterface[];
		try {
			tokens = await this.model.getTokens();
		} catch (error) {
			this.setMessage(this.errorMessage(error));
			return;
		}

		const heading = document.createElement('h4');
		heading.textContent = 'Active tokens';
		this.tokensElm.appendChild(heading);
		if (tokens.length === 0) {
			const empty = document.createElement('p');
			empty.textContent = 'No API tokens yet.';
			this.tokensElm.appendChild(empty);
			return;
		}

		const table = document.createElement('table');
		const header = document.createElement('tr');
		for (const label of ['Description', 'Created', 'Last used', '']) {
			const cell = document.createElement('th');
			cell.textContent = label;
			header.appendChild(cell);
		}
		table.appendChild(header);

		for (const token of tokens) {
			const row = document.createElement('tr');
			row.appendChild(this.tableCell(token.Description));
			row.appendChild(this.tableCell(this.formatTimestamp(token.Created)));
			row.appendChild(this.tableCell(token.LastUsed === null ? 'Never' : this.formatTimestamp(token.LastUsed)));

			const actionCell = document.createElement('td');
			const revokeButton = document.createElement('button');
			revokeButton.type = 'button';
			revokeButton.textContent = 'Revoke';
			revokeButton.classList.add('danger');
			revokeButton.addEventListener('click', async () => {
				if (confirm(`Revoke the token “${token.Description}”? This cannot be undone.`)) {
					await this.deleteToken(token);
				}
			});
			actionCell.appendChild(revokeButton);
			row.appendChild(actionCell);
			table.appendChild(row);
		}

		this.tokensElm.appendChild(table);
	}

	private async deleteToken(token: UserAPITokenInterface) {
		this.setMessage('');
		try {
			await this.model.deleteToken(token);
		} catch (error) {
			this.setMessage(this.errorMessage(error));
		}
	}

	private showCreatedToken(token: string) {
		this.createdTokenElm.innerHTML = '';
		const warning = document.createElement('p');
		warning.textContent = 'Copy this token now. It will not be shown again.';
		const input = document.createElement('input');
		input.value = token;
		input.readOnly = true;
		input.addEventListener('click', () => input.select());
		const copyButton = document.createElement('button');
		copyButton.type = 'button';
		copyButton.textContent = 'Copy';
		copyButton.addEventListener('click', async () => {
			await navigator.clipboard.writeText(token);
			copyButton.textContent = 'Copied!';
		});

		this.createdTokenElm.append(warning, input, copyButton);
	}

	private tableCell(value: string) {
		const cell = document.createElement('td');
		cell.textContent = value;
		return cell;
	}

	private formatTimestamp(value: string) {
		return new Date(value).toLocaleString();
	}

	private errorMessage(error: unknown) {
		if (isRequestError(error)) {
			return error.ctx.responseText;
		}
		return 'Unable to manage API tokens.';
	}

	private setMessage(message: string) {
		this.messageElm.textContent = message;
	}

}
