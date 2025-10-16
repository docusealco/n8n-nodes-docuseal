import type { INodeProperties } from 'n8n-workflow';

export const createSubmissionDescription: INodeProperties[] = [
  {
    displayName: 'Template Name or ID',
    name: 'templateId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTemplates',
      loadOptionsDependsOn: ['authentication'],
    },
    required: true,
    default: '',
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        operation: ['createSubmission'],
      },
    },
  },
  {
    displayName: 'Email Subject',
    name: 'emailSubject',
    type: 'string',
    default: '',
    description: 'Subject for the notification email. If you set this, you should also set Email Body.',
    displayOptions: {
      show: {
        operation: ['createSubmission'],
      },
    },
  },
  {
    displayName: 'Email Body',
    name: 'emailBody',
    type: 'string',
    typeOptions: { rows: 4 },
    default: '',
    description: 'Body for the notification email. If you set this, you should also set Email Subject.',
    displayOptions: {
      show: {
        operation: ['createSubmission'],
      },
    },
  },
  {
    displayName: 'Send Email',
    name: 'sendEmail',
    type: 'boolean',
    default: true,
    description: 'Whether to send an email notification to each signer',
    displayOptions: {
      show: {
        operation: ['createSubmission'],
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
        operation: ['createSubmission'],
      },
    },
  },
  {
    displayName: 'Submitters Order',
    name: 'order',
    type: 'options',
    options: [
      { name: 'Preserved', value: 'preserved' },
      { name: 'Random', value: 'random' },
    ],
    default: 'preserved',
    description: "If 'random', all parties are notified right away. If 'preserved', the next party is notified only after the previous completes signing.",
    displayOptions: {
      show: {
        operation: ['createSubmission'],
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
        operation: ['createSubmission'],
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
        operation: ['createSubmission'],
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
        operation: ['createSubmission'],
      },
    },
  },
  {
    displayName: 'Expire At',
    name: 'expireAt',
    type: 'string',
    default: '',
    description: 'Expiration datetime (ISO 8601). After this the submission becomes unavailable for signing.',
    displayOptions: {
      show: {
        operation: ['createSubmission'],
      },
    },
  },
  {
    displayName: 'Submitters',
    name: 'submittersUi',
    placeholder: 'Add Submitter',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    description: 'Define each signer (submitter) and their options. Order here matches the send order when order=preserved.',
    options: [
      {
        name: 'submitter',
        displayName: 'Submitter',
        values: [
          {
            displayName: 'Completed (Auto-Sign)',
            name: 'completed',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            placeholder: 'Enter email address',
            default: '',
          },
          {
            displayName: 'External ID',
            name: 'external_id',
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
          },
          {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Redirect URL',
            name: 'completed_redirect_url',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Reply-To',
            name: 'reply_to',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Require Phone 2FA',
            name: 'require_phone_2fa',
            type: 'boolean',
            default: false,
            description: 'Whether to require phone 2FA via one-time code to access documents',
          },
          {
            displayName: 'Send Email',
            name: 'send_email',
            type: 'boolean',
            default: true,
          },
          {
            displayName: 'Send SMS',
            name: 'send_sms',
            type: 'boolean',
            default: false,
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
        operation: ['createSubmission'],
      },
    },
  },
];
