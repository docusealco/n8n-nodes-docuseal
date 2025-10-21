import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { apiRequest } from './GenericFunctions';

export class DocusealTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocuSeal Trigger',
		name: 'docusealTrigger',
		icon: 'file:logo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle DocuSeal events via webhooks',
		defaults: {
			name: 'DocuSeal Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'docusealOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
			{
				name: 'docusealApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['accessToken'],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'accessToken',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'submission.completed',
				options: [
					{
						name: 'Signing Form Completed',
						value: 'form.completed',
						description: 'Triggers when a signing form is completed by a signer',
					},
					{
						name: 'Submission Completed',
						value: 'submission.completed',
						description: 'Triggers when a submission is completed by all parties',
					},
				],
				description: 'The event to listen to',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhooks = await apiRequest.call(this, 'GET', '/webhook_urls', {}, {});

				for (const webhook of webhooks.data || []) {
					if (webhook.url === webhookUrl) {
						webhookData.webhookId = webhook.id;

						return true;
					}
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;

				const body: IDataObject = {
					url: webhookUrl,
					events: [event],
				};

				const response = await apiRequest.call(this, 'POST', '/webhook_urls', body, {});

				if (response.id === undefined) {
					return false;
				}

				webhookData.webhookId = response.id as string;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await apiRequest.call(this, 'DELETE', `/webhook_urls/${webhookData.webhookId}`, {}, {});
					} catch (error) {
						return false;
					}

					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = req.body as IDataObject;

		if (!body || !body.data) {
			return {
				workflowData: [[]],
			};
		}

		const eventData = body.data as IDataObject;

		return {
			workflowData: [this.helpers.returnJsonArray(eventData)],
		};
	}
}
