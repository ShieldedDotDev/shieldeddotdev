type RequestModInterface = (mods: XMLHttpRequest) => void;

export async function doRequest<T>(
	endpoint: string,
	method: string = 'GET',
	body: string | null = null,
	mods: RequestModInterface = () => { },
): Promise<T> {
	const text = await doRawRequest(endpoint, method, body, mods);
	return new Promise<T>((resolve) => {
		const data = JSON.parse(text);
		resolve(data);
	});
}

export function doRawRequest(
	endpoint: string,
	method: string = 'GET',
	body: string | null = null,
	mods: RequestModInterface = () => { },
): Promise<string> {
	const request = new XMLHttpRequest();
	request.open(method, `/${endpoint}`, true);

	mods(request);

	return new Promise<string>((resolve, reject) => {
		request.addEventListener('load', function(e) {
			if (this.status >= 200 && this.status < 400) {
				resolve(this.responseText);
			} else {
				reject({ ctx: this, event: e });
			}
		});

		request.withCredentials = true;

		request.addEventListener('error', function(e) {
			reject({ ctx: this, event: e });
		});
		if (body) {
			request.send(body);
		} else {
			request.send();
		}
	});
}
