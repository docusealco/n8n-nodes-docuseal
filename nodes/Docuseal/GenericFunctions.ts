import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: `/${string}`,
	body: object,
	query?: IDataObject,
	uri?: string,
): Promise<any> {
	const authenticationMethod = this.getNodeParameter('authentication', 0) as string;

	const baseUrl = await resolveBaseUrl.call(this, authenticationMethod);

	const options: IHttpRequestOptions = {
		headers: {},
		method,
		body: method === 'GET' || method === 'HEAD' || method === 'DELETE' ? null : body,
		qs: query,
		url: uri || `${baseUrl}${endpoint}`,
		json: true,
	};

	if (options.body === null) {
		delete options.body;
	}

	return await requestWithAuth.call(this, authenticationMethod, options);
}

async function resolveBaseUrl(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	auth: string,
): Promise<string> {
	if (auth === 'oAuth2') {
		const creds = (await this.getCredentials('docusealOAuth2Api')) as {
			cloudRegion?: 'com' | 'eu';
		};
		return creds?.cloudRegion === 'eu' ? 'https://api.docuseal.eu' : 'https://api.docuseal.com';
	} else {
		const creds = (await this.getCredentials('docusealApi')) as { baseUrl?: string };
		const base = creds?.baseUrl || 'https://api.docuseal.com';
		return base.replace(/\/+$/, '');
	}
}

async function requestWithAuth(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	auth: string,
	req: IHttpRequestOptions,
): Promise<any> {
	if (auth === 'oAuth2') {
		return this.helpers.httpRequestWithAuthentication.call(this, 'docusealOAuth2Api', req);
	} else {
		return this.helpers.httpRequestWithAuthentication.call(this, 'docusealApi', req);
	}
}
