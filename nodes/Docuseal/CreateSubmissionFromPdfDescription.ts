import type { INodeProperties } from 'n8n-workflow';

export const createSubmissionFromPdfDescription: INodeProperties[] = [
	{
		displayName: 'Submission Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the document submission',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Documents',
		name: 'documents',
		placeholder: 'Add Document',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'PDF documents to include in the submission',
		options: [
			{
				name: 'document',
				displayName: 'Document',
				values: [
					{
						displayName: 'Document Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the document',
					},
					{
						displayName: 'File',
						name: 'file',
						type: 'string',
						default: '',
						required: true,
						description: 'Base64-encoded content of the PDF file or downloadable file URL',
					},
					{
						displayName: 'Position',
						name: 'position',
						type: 'number',
						default: 0,
						description: 'Document position in the submission',
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Submitters',
		name: 'submitters',
		placeholder: 'Add Signer',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Define each signer and their options',
		options: [
			{
				name: 'submitter',
				displayName: 'Signer',
				values: [
					{
						displayName: 'Completed (Auto-Sign)',
						name: 'completed',
						type: 'boolean',
						default: false,
						description: 'Whether to mark signer as completed and auto-signed via API',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						required: true,
						placeholder: 'Enter email address',
						description: 'Signer email',
						default: '',
					},
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',
						description: 'Your application-specific unique string key to identify this signer',
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
						description: 'Phone number, formatted according to the E.164 standard',
					},
					{
						displayName: 'Redirect URL',
						name: 'completed_redirect_url',
						type: 'string',
						default: '',
						description: 'URL to redirect the signer to after they have completed the signing',
					},
					{
						displayName: 'Reply-To',
						name: 'reply_to',
						type: 'string',
						default: '',
						description: 'Reply-To address to use in the notification emails for this signer',
					},
					{
						displayName: 'Require Phone 2FA',
						name: 'require_phone_2fa',
						type: 'boolean',
						default: false,
						description: 'Whether to require phone 2FA verification via a one-time code',
					},
					{
						displayName: 'Send Email',
						name: 'send_email',
						type: 'boolean',
						default: true,
						description: 'Whether to send an email notification to the signer',
					},
					{
						displayName: 'Send SMS',
						name: 'send_sms',
						type: 'boolean',
						default: false,
						description: 'Whether to send signature request via phone number and SMS',
					},
					{
						displayName: 'Signer Role',
						name: 'role',
						type: 'string',
						required: true,
						default: '',
						description: 'Role of the signer',
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
						description: 'Field values to pre-fill for this signer',
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
			},
		],
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Send Email',
		name: 'sendEmail',
		type: 'boolean',
		default: true,
		description: 'Whether to send an email notification to signers',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Send SMS',
		name: 'sendSms',
		type: 'boolean',
		default: false,
		description: 'Whether to send signature request via phone number and SMS',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Email Subject',
		name: 'emailSubject',
		type: 'string',
		default: '',
		description: 'Subject of the email notification. Email body must also be provided.',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Email Body',
		name: 'emailBody',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		description: 'Body of the email notification. Email subject must also be provided.',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Template IDs',
		name: 'templateIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of template IDs to merge with the documents',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Signers Order',
		name: 'order',
		type: 'options',
		options: [
			{ name: 'Preserved', value: 'preserved' },
			{ name: 'Random', value: 'random' },
		],
		default: 'preserved',
		description:
			"If 'random', all parties are notified right away. If 'preserved', signers are notified sequentially.",
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'BCC Email Address',
		name: 'bccCompleted',
		type: 'string',
		default: '',
		description: 'BCC address to send signed documents to after completion',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Reply-To Email Address',
		name: 'replyTo',
		type: 'string',
		default: '',
		description: 'Reply-To address to use in the notification emails',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Redirect URL',
		name: 'completedRedirectUrl',
		type: 'string',
		default: '',
		description: 'URL to redirect the signer to after they have completed the signing',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Expire At',
		name: 'expireAt',
		type: 'dateTime',
		default: '',
		description:
			'Expiration datetime (ISO 8601). After this the submission becomes unavailable for signing.',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Flatten',
		name: 'flatten',
		type: 'boolean',
		default: false,
		description: 'Whether to remove PDF form fields from the documents',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Merge Documents',
		name: 'mergeDocuments',
		type: 'boolean',
		default: false,
		description: 'Whether to merge the documents into a single PDF file',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
	{
		displayName: 'Remove Tags',
		name: 'removeTags',
		type: 'boolean',
		default: true,
		description:
			'Whether to remove {{text}} tags from the PDF. Can be used with transparent text tags for faster PDF processing.',
		displayOptions: {
			show: {
				operation: ['createSubmissionFromPdf'],
			},
		},
	},
];
