import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class DocusealOAuth2Api implements ICredentialType {
	name = 'docusealOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'DocuSeal OAuth2 API';
	icon: Icon = { light: 'file:../nodes/Docuseal/logo.svg', dark: 'file:../nodes/Docuseal/logo.svg' };
	documentationUrl = 'https://www.docuseal.com/docs/api';

	properties: INodeProperties[] = [
		 {
      displayName: 'Cloud Region',
      name: 'cloudRegion',
      type: 'options',
      default: 'com',
      options: [
        { name: 'Global', value: 'com' },
        { name: 'Europe', value: 'eu' },
      ],
    },
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: "={{$self.cloudRegion === 'eu' ? 'https://docuseal.eu/oauth/authorize' : 'https://docuseal.com/oauth/authorize'}}",
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: "={{$self.cloudRegion === 'eu' ? 'https://docuseal.eu/oauth/token' : 'https://docuseal.com/oauth/token'}}",
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'repo',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
