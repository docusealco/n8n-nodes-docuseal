import type { INodeProperties } from 'n8n-workflow';

export const updateSubmitterDescription: INodeProperties[] = [
	{
		displayName: 'Signer ID',
		name: 'submitterId',
		type: 'string',
		required: true,
		default: '',
		description: 'The unique identifier of the signer',
		displayOptions: {
			show: {
				operation: ['updateSubmitter'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Only the fields added here are sent to the API. Everything else stays unchanged.',
		options: [
			{
				displayName: 'Completed (Auto-Sign)',
				name: 'completed',
				type: 'boolean',
				default: false,
				description: 'Whether to mark the signer as completed and auto-signed via API',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'Enter email address',
				default: '',
				description: 'Signer email',
			},
			{
				displayName: 'Email Body',
				name: 'emailBody',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description:
					'Body for the notification email. If you set this, you should also set Email Subject.',
			},
			{
				displayName: 'Email Subject',
				name: 'emailSubject',
				type: 'string',
				default: '',
				description:
					'Subject for the notification email. If you set this, you should also set Email Body.',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'Your app-specific unique key to identify this signer',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				placeholder: 'Add Key/Value',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Metadata key-value pairs',
				options: [
					{
						name: 'pair',
						displayName: 'Key/Value',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Signer name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Signer phone, formatted according to the E.164 standard',
			},
			{
				displayName: 'Re-Send Email',
				name: 'sendEmail',
				type: 'boolean',
				default: false,
				description: 'Whether to re-send the signature request email to the signer',
			},
			{
				displayName: 'Re-Send SMS',
				name: 'sendSms',
				type: 'boolean',
				default: false,
				description: 'Whether to re-send the signature request via phone number SMS',
			},
			{
				displayName: 'Redirect URL',
				name: 'completedRedirectUrl',
				type: 'string',
				default: '',
				description: 'URL to redirect the signer to after they have completed the signing',
			},
			{
				displayName: 'Reply-To Email Address',
				name: 'replyTo',
				type: 'string',
				default: '',
				description: 'Reply-To address to use in the notification emails',
			},
			{
				displayName: 'Require Email 2FA',
				name: 'requireEmail2fa',
				type: 'boolean',
				default: false,
				description: 'Whether to require email 2FA via one-time code to access documents',
			},
			{
				displayName: 'Require Phone 2FA',
				name: 'requirePhone2fa',
				type: 'boolean',
				default: false,
				description: 'Whether to require phone 2FA via one-time code to access documents',
			},
			{
				displayName: 'Values (Pre-Fill Fields)',
				name: 'values',
				placeholder: 'Add Field Name/Value',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Field values to pre-fill or update for this signer',
				options: [
					{
						name: 'pair',
						displayName: 'Field Value',
						values: [
							{
								displayName: 'Field Name',
								name: 'field',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['updateSubmitter'],
			},
		},
	},
];
