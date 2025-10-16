import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { apiRequest } from './GenericFunctions';
import { createSubmissionDescription } from './CreateSubmissionDescription';
import { createSubmissionFromDocxDescription } from './CreateSubmissionFromDocxDescription';
import { createSubmissionFromHtmlDescription } from './CreateSubmissionFromHtmlDescription';
import { createSubmissionFromPdfDescription } from './CreateSubmissionFromPdfDescription';

export class Docuseal implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'DocuSeal',
    name: 'docuseal',
    icon: 'file:logo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with DocuSeal API',
    defaults: {
      name: 'DocuSeal',
    },
    inputs: ['main'],
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
        displayName: 'Operation',
        noDataExpression: true,
        name: 'operation',
        type: 'options',
        default: 'createSubmission',
        options: [
          {
            name: 'Create Submission',
            value: 'createSubmission',
            description: 'Create a signature request from template',
            action: 'Create submission',
          },
          {
            name: 'Create Submission From DOCX',
            value: 'createSubmissionFromDocx',
            description: 'Create a signature request from DOCX file with dynamic variables',
            action: 'Create submission from DOCX',
          },
          {
            name: 'Create Submission From HTML',
            value: 'createSubmissionFromHtml',
            description: 'Create a signature request from HTML content',
            action: 'Create submission from HTML',
          },
          {
            name: 'Create Submission From PDF',
            value: 'createSubmissionFromPdf',
            description: 'Create a signature request from PDF document',
            action: 'Create submission from PDF',
          },
        ],
      },
      ...createSubmissionDescription,
      ...createSubmissionFromDocxDescription,
      ...createSubmissionFromHtmlDescription,
      ...createSubmissionFromPdfDescription,
    ],
  };

  methods = {
    loadOptions: {
      async getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const currentValue = this.getCurrentNodeParameter('templateId') as string;

        const qs: IDataObject = { per_page: 50 };

        if (currentValue && typeof currentValue === 'string' && currentValue.length > 0) {
          qs.q = currentValue;
        }

        const response = await apiRequest.call(this, 'GET', '/templates', {}, qs);
        const list: Array<{ id: number; name: string }> = response?.data || [];

        return list.map((t) => ({
          name: `${t.name} (${t.id})`,
          value: t.id,
        }));
      }
    },
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const length = items.length || 1;

    for (let i = 0; i < length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      if (operation === 'createSubmission') {
        const data = await createSubmission.call(this, i);
        returnData.push(data);
      } else if (operation === 'createSubmissionFromDocx') {
        const data = await createSubmissionFromDocx.call(this, i);
        returnData.push(data);
      } else if (operation === 'createSubmissionFromHtml') {
        const data = await createSubmissionFromHtml.call(this, i);
        returnData.push(data);
      } else if (operation === 'createSubmissionFromPdf') {
        const data = await createSubmissionFromPdf.call(this, i);
        returnData.push(data);
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}

async function createSubmission(
  this: IExecuteFunctions,
  i: number,
): Promise<IDataObject> {
  const templateId = this.getNodeParameter('templateId', i) as number;
  const sendEmail = this.getNodeParameter('sendEmail', i) as boolean;
  const sendSms = this.getNodeParameter('sendSms', i) as boolean;
  const emailSubject = this.getNodeParameter('emailSubject', i, '') as string;
  const emailBody = this.getNodeParameter('emailBody', i, '') as string;
  const order = this.getNodeParameter('order', i) as string;
  const bccCompleted = this.getNodeParameter('bccCompleted', i, '') as string;
  const replyTo = this.getNodeParameter('replyTo', i, '') as string;
  const completedRedirectUrl = this.getNodeParameter('completedRedirectUrl', i, '') as string;
  const expireAt = this.getNodeParameter('expireAt', i, '') as string;

  const payload: IDataObject = {
    template_id: templateId,
    send_email: sendEmail,
    send_sms: sendSms,
    order,
    bcc_completed: bccCompleted || undefined,
    reply_to: replyTo || undefined,
    completed_redirect_url: completedRedirectUrl || undefined,
    expire_at: expireAt || undefined,
  };

  if (emailSubject && emailBody) {
    payload.message = { subject: emailSubject, body: emailBody } as IDataObject;
  }

  const submittersUi = this.getNodeParameter('submittersUi', i, {}) as {
    submitter?: Array<IDataObject>;
  };

  const submittersPayload: IDataObject[] = [];

  for (const entry of submittersUi.submitter ?? []) {
    const sub: IDataObject = {};

    for (const key of [
      'name',
      'email',
      'phone',
      'send_email',
      'send_sms',
      'require_phone_2fa',
      'completed_redirect_url',
      'reply_to',
      'external_id',
      'completed',
    ]) {
      if (entry[key] !== undefined && entry[key] !== '') {
        sub[key] = entry[key];
      }
    }

    const valuesData = entry.values as any;

    if (valuesData && valuesData.pair && Array.isArray(valuesData.pair)) {
      const pairs = valuesData.pair as Array<{ field: string; value: string }>;

      if (pairs.length) {
        const values: IDataObject = {};

        for (const { field, value } of pairs) {
          if (field) values[field] = value;
        }

        sub.values = values;
      }
    }

    const metadataData = entry.metadata as any;

    if (metadataData && metadataData.pair && Array.isArray(metadataData.pair)) {
      const pairs = metadataData.pair as Array<{ key: string; value: string }>;

      if (pairs.length) {
        const metadata: IDataObject = {};

        for (const { key, value } of pairs) {
          if (key) metadata[key] = value;
        }

        sub.metadata = metadata;
      }
    }

    submittersPayload.push(sub);
  }

  if (submittersPayload.length) {
    payload.submitters = submittersPayload;
  }

  cleanPayload(payload);

  const data = await apiRequest.call(this, 'POST', '/submissions/init', payload);
  return data as IDataObject;
}

async function createSubmissionFromDocx(
  this: IExecuteFunctions,
  i: number,
): Promise<IDataObject> {
  const name = this.getNodeParameter('name', i, '') as string;
  const sendEmail = this.getNodeParameter('sendEmail', i) as boolean;
  const sendSms = this.getNodeParameter('sendSms', i) as boolean;
  const emailSubject = this.getNodeParameter('emailSubject', i, '') as string;
  const emailBody = this.getNodeParameter('emailBody', i, '') as string;
  const order = this.getNodeParameter('order', i) as string;
  const bccCompleted = this.getNodeParameter('bccCompleted', i, '') as string;
  const replyTo = this.getNodeParameter('replyTo', i, '') as string;
  const completedRedirectUrl = this.getNodeParameter('completedRedirectUrl', i, '') as string;
  const expireAt = this.getNodeParameter('expireAt', i, '') as string;
  const templateIds = this.getNodeParameter('templateIds', i, '') as string;
  const mergeDocuments = this.getNodeParameter('mergeDocuments', i, false) as boolean;

  const payload: IDataObject = {
    name,
    send_email: sendEmail,
    send_sms: sendSms,
    order,
    bcc_completed: bccCompleted || undefined,
    reply_to: replyTo || undefined,
    completed_redirect_url: completedRedirectUrl || undefined,
    expire_at: expireAt || undefined,
    merge_documents: mergeDocuments,
  };

  if (templateIds) {
    payload.template_ids = templateIds.split(',').map((id) => id.trim());
  }

  const variablesUi = this.getNodeParameter('variables', i, {}) as {
    pair?: Array<{ key: string; value: string }>;
  };

  if (variablesUi.pair && variablesUi.pair.length) {
    const variables: IDataObject = {};

    for (const { key, value } of variablesUi.pair) {
      if (key) variables[key] = value;
    }

    payload.variables = variables;
  }

  const documentsUi = this.getNodeParameter('documents', i, {}) as {
    document?: Array<IDataObject>;
  };

  if (documentsUi.document && documentsUi.document.length) {
    payload.documents = documentsUi.document.map((doc) => {
      const document: IDataObject = {};
      if (doc.name) document.name = doc.name;
      if (doc.file) document.file = doc.file;
      if (doc.position !== undefined) document.position = doc.position;
      return document;
    });
  }

  const submittersPayload = processSubmitters.call(this, i);
  if (submittersPayload.length) {
    payload.submitters = submittersPayload;
  }

  if (emailSubject && emailBody) {
    payload.message = { subject: emailSubject, body: emailBody };
  }

  cleanPayload(payload);

  const data = await apiRequest.call(this, 'POST', '/submissions/docx', payload);
  return data as IDataObject;
}

async function createSubmissionFromHtml(
  this: IExecuteFunctions,
  i: number,
): Promise<IDataObject> {
  const name = this.getNodeParameter('name', i, '') as string;
  const sendEmail = this.getNodeParameter('sendEmail', i) as boolean;
  const sendSms = this.getNodeParameter('sendSms', i) as boolean;
  const emailSubject = this.getNodeParameter('emailSubject', i, '') as string;
  const emailBody = this.getNodeParameter('emailBody', i, '') as string;
  const order = this.getNodeParameter('order', i) as string;
  const bccCompleted = this.getNodeParameter('bccCompleted', i, '') as string;
  const replyTo = this.getNodeParameter('replyTo', i, '') as string;
  const completedRedirectUrl = this.getNodeParameter('completedRedirectUrl', i, '') as string;
  const expireAt = this.getNodeParameter('expireAt', i, '') as string;
  const templateIds = this.getNodeParameter('templateIds', i, '') as string;
  const mergeDocuments = this.getNodeParameter('mergeDocuments', i, false) as boolean;

  const payload: IDataObject = {
    name,
    send_email: sendEmail,
    send_sms: sendSms,
    order,
    bcc_completed: bccCompleted || undefined,
    reply_to: replyTo || undefined,
    completed_redirect_url: completedRedirectUrl || undefined,
    expire_at: expireAt || undefined,
    merge_documents: mergeDocuments,
  };

  if (templateIds) {
    payload.template_ids = templateIds.split(',').map((id) => id.trim());
  }

  const documentsUi = this.getNodeParameter('documents', i, {}) as {
    document?: Array<IDataObject>;
  };

  if (documentsUi.document && documentsUi.document.length) {
    payload.documents = documentsUi.document.map((doc) => {
      const document: IDataObject = {};
      if (doc.name) document.name = doc.name;
      if (doc.html) document.html = doc.html;
      if (doc.html_header) document.html_header = doc.html_header;
      if (doc.html_footer) document.html_footer = doc.html_footer;
      if (doc.size) document.size = doc.size;
      if (doc.position !== undefined) document.position = doc.position;
      return document;
    });
  }

  const submittersPayload = processSubmitters.call(this, i);
  if (submittersPayload.length) {
    payload.submitters = submittersPayload;
  }

  if (emailSubject && emailBody) {
    payload.message = { subject: emailSubject, body: emailBody };
  }

  cleanPayload(payload);

  const data = await apiRequest.call(this, 'POST', '/submissions/html', payload);
  return data as IDataObject;
}

async function createSubmissionFromPdf(
  this: IExecuteFunctions,
  i: number,
): Promise<IDataObject> {
  const name = this.getNodeParameter('name', i, '') as string;
  const sendEmail = this.getNodeParameter('sendEmail', i) as boolean;
  const sendSms = this.getNodeParameter('sendSms', i) as boolean;
  const emailSubject = this.getNodeParameter('emailSubject', i, '') as string;
  const emailBody = this.getNodeParameter('emailBody', i, '') as string;
  const order = this.getNodeParameter('order', i) as string;
  const bccCompleted = this.getNodeParameter('bccCompleted', i, '') as string;
  const replyTo = this.getNodeParameter('replyTo', i, '') as string;
  const completedRedirectUrl = this.getNodeParameter('completedRedirectUrl', i, '') as string;
  const expireAt = this.getNodeParameter('expireAt', i, '') as string;
  const templateIds = this.getNodeParameter('templateIds', i, '') as string;
  const mergeDocuments = this.getNodeParameter('mergeDocuments', i, false) as boolean;
  const flatten = this.getNodeParameter('flatten', i, false) as boolean;
  const removeTags = this.getNodeParameter('removeTags', i, true) as boolean;

  const payload: IDataObject = {
    name,
    send_email: sendEmail,
    send_sms: sendSms,
    order,
    bcc_completed: bccCompleted || undefined,
    reply_to: replyTo || undefined,
    completed_redirect_url: completedRedirectUrl || undefined,
    expire_at: expireAt || undefined,
    merge_documents: mergeDocuments,
    flatten,
    remove_tags: removeTags,
  };

  if (templateIds) {
    payload.template_ids = templateIds.split(',').map((id) => id.trim());
  }

  const documentsUi = this.getNodeParameter('documents', i, {}) as {
    document?: Array<IDataObject>;
  };

  if (documentsUi.document && documentsUi.document.length) {
    payload.documents = documentsUi.document.map((doc) => {
      const document: IDataObject = {};
      if (doc.name) document.name = doc.name;
      if (doc.file) document.file = doc.file;
      if (doc.position !== undefined) document.position = doc.position;
      return document;
    });
  }

  const submittersPayload = processSubmitters.call(this, i);
  if (submittersPayload.length) {
    payload.submitters = submittersPayload;
  }

  if (emailSubject && emailBody) {
    payload.message = { subject: emailSubject, body: emailBody };
  }

  cleanPayload(payload);

  const data = await apiRequest.call(this, 'POST', '/submissions/pdf', payload);
  return data as IDataObject;
}

function processSubmitters(this: IExecuteFunctions, i: number): IDataObject[] {
  const submittersUi = this.getNodeParameter('submitters', i, {}) as {
    submitter?: Array<IDataObject>;
  };

  const submittersPayload: IDataObject[] = [];

  for (const entry of submittersUi.submitter ?? []) {
    const sub: IDataObject = {};

    for (const key of [
      'role',
      'name',
      'email',
      'phone',
      'send_email',
      'send_sms',
      'require_phone_2fa',
      'completed_redirect_url',
      'reply_to',
      'external_id',
      'completed',
    ]) {
      if (entry[key] !== undefined && entry[key] !== '') {
        sub[key] = entry[key];
      }
    }

    const valuesData = entry.values as any;

    if (valuesData && valuesData.pair && Array.isArray(valuesData.pair)) {
      const pairs = valuesData.pair as Array<{ field: string; value: string }>;

      if (pairs.length) {
        const values: IDataObject = {};

        for (const { field, value } of pairs) {
          if (field) values[field] = value;
        }

        sub.values = values;
      }
    }

    const metadataData = entry.metadata as any;

    if (metadataData && metadataData.pair && Array.isArray(metadataData.pair)) {
      const pairs = metadataData.pair as Array<{ key: string; value: string }>;

      if (pairs.length) {
        const metadata: IDataObject = {};

        for (const { key, value } of pairs) {
          if (key) metadata[key] = value;
        }

        sub.metadata = metadata;
      }
    }

    submittersPayload.push(sub);
  }

  return submittersPayload;
}

function cleanPayload(payload: IDataObject): void {
  Object.keys(payload).forEach((k) => {
    const v = payload[k];

    if (v === '' || v === null || v === undefined) {
      delete payload[k];
    }
  });
}
