import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DocusealApi implements ICredentialType {
	name = 'docusealApi';
	displayName = 'DocuSeal API';
	icon: Icon = {
		light: 'file:../nodes/Docuseal/logo.svg',
		dark: 'file:../nodes/Docuseal/logo.svg',
	};
	documentationUrl = 'https://www.docuseal.com/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Server Domain',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.docuseal.com',
			description: 'For example: https://sign.mycompany.tld',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Auth-Token': '={{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/user',
			method: 'GET',
		},
	};
}
