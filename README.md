# n8n-nodes-docuseal

This is an **n8n community node** that allows you to integrate [DocuSeal](https://www.docuseal.com) with your n8n workflows.

[DocuSeal](https://www.docuseal.com) is a modern document signing platform that lets you securely collect legally binding electronic signatures online. You can create templates, send signature requests, and automate your signing process with ease.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage Examples](#usage-examples)
- [Resources](#resources)
- [License](#license)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) from the n8n documentation.

### Community Nodes (Recommended)

For n8n cloud or instances with UI access:

1. Go to **Settings → Community Nodes** in your n8n dashboard.
2. Click **Install**.
3. Enter `@docuseal/n8n-nodes-docuseal` in the **Enter npm package name** field.
4. Accept the [community node usage risks](https://docs.n8n.io/integrations/community-nodes/risks/).
5. Click **Install** to complete setup.

### npm Installation

To install manually in your n8n root directory:

```bash
npm install @docuseal/n8n-nodes-docuseal
```

### Docker Installation

For Docker users, add the package to your setup using environment variables:

**docker-compose.yml:**
```yaml
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    environment:
      - N8N_COMMUNITY_PACKAGES=@docuseal/n8n-nodes-docuseal
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
```

**Docker run command:**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_COMMUNITY_PACKAGES="@docuseal/n8n-nodes-docuseal" \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

## Operations

This package includes two nodes:

### DocuSeal Node

The main node for creating and managing signature requests.

#### Create Submission
Create a signature request from an existing template.

**Features:**
- Select from your existing templates
- Define multiple signers with their details
- Pre-fill form fields
- Customize email notifications
- Set expiration dates
- Configure signing order (sequential or random)

#### Create Submission From DOCX
Create a signature request from DOCX files with dynamic content.

**Features:**
- Upload DOCX or PDF files
- Use dynamic variables for content replacement
- Merge multiple documents
- Define signers with roles
- Support for template merging

#### Create Submission From HTML
Generate signature requests from HTML content.

**Features:**
- HTML document content with field tags
- Custom headers and footers
- Multiple page sizes (Letter, A4, Legal, etc.)
- Merge with existing templates
- Convert HTML to PDF automatically

#### Create Submission From PDF
Create signature requests from PDF documents.

**Features:**
- Upload PDF files (Base64 or URL)
- Flatten PDF form fields
- Remove or preserve text tags
- Merge multiple PDFs
- Template integration

### DocuSeal Trigger Node

Webhook-based trigger for DocuSeal events.

#### Signing Form Completed
Triggers when a single signer completes their signing form.

**Use cases:**
- Send notifications to internal teams
- Update CRM records
- Trigger follow-up workflows

#### Submission Completed
Triggers when all parties complete the signing process.

**Use cases:**
- Archive completed documents
- Send completion notifications
- Update databases with signed document URLs
- Generate invoices or contracts

## Credentials

You'll need your **DocuSeal API key** to connect n8n to your account.

### Getting Your API Key

1. Create an account at [DocuSeal Global Dashboard](https://docuseal.com/sign_in) or [DocuSeal Europe Dashboard](https://docuseal.eu/sign_in)
2. Go to **Settings → Console → API**
3. Copy an API key for your account

### Setting Up Credentials in n8n

1. In n8n, click on **Credentials** in the left sidebar
2. Click **Add Credential**
3. Search for "DocuSeal" and select **DocuSeal API**
4. Fill in the following fields:
   - **API Key** – your generated API key
   - **Server** – choose between *Global Server* or *Europe Server*
5. Click **Save**

### Authentication Methods

This node supports two authentication methods:

- **Access Token** (recommended) - Use your API key directly
- **OAuth2** - For more secure integrations (requires app setup)

## Compatibility

- **n8n** version `0.187.0` or later
- **Node.js** version `18.10` or later

## Usage Examples

### Example 1: Automated Contract Signing

Send contracts for signing whenever a new deal is created in your CRM:

1. **Trigger**: CRM Trigger (e.g., HubSpot, Salesforce)
2. **DocuSeal Node**: Create Submission
   - Template: "Sales Contract"
   - Signer Email: `{{$json.contact_email}}`
   - Pre-fill fields with deal data
3. **Slack Node**: Notify sales team

### Example 2: Onboarding Automation

Automatically send onboarding documents to new employees:

1. **Trigger**: HR System Webhook
2. **DocuSeal Node**: Create Submission From DOCX
   - Upload employee handbook
   - Variables: Employee name, start date, department
   - Signers: New employee + HR manager
3. **Email Node**: Send welcome email with signing link

### Example 3: Document Archive Workflow

Archive completed documents automatically:

1. **DocuSeal Trigger**: Submission Completed
2. **HTTP Request Node**: Download signed PDF
3. **Google Drive Node**: Upload to archive folder
4. **Database Node**: Update records with document URL

### Example 4: Multi-Party Signing

Send documents requiring multiple signatures in sequence:

1. **Google Sheets Trigger**: New row in contracts sheet
2. **DocuSeal Node**: Create Submission
   - Signers Order: "Preserved"
   - Signer 1: Client
   - Signer 2: Account Manager
   - Signer 3: Legal Team
3. **Slack Node**: Notify when all parties sign

## Advanced Features

### Pre-filling Form Fields

You can pre-fill form fields in your templates using the `Values` parameter in submitters:

```json
{
  "field": "Company Name",
  "value": "{{$json.company}}"
}
```

### Custom Email Notifications

Customize the email sent to signers:

- **Email Subject**: Your custom subject line
- **Email Body**: Your custom message (supports plain text)
- **Reply-To**: Set a custom reply-to address
- **BCC**: Add BCC recipients for completed documents

### Metadata and External IDs

Track your documents by adding:

- **External ID**: Your internal reference ID
- **Metadata**: Custom key-value pairs for additional data

### Expiration Dates

Set expiration dates for signature requests:
- After expiration, the signing link becomes unavailable
- Use ISO 8601 format: `2025-12-31T23:59:59Z`

## Troubleshooting

### Common Issues

**Issue**: "Invalid API Key" error
**Solution**: Verify your API key is correct and matches the selected server (Global/Europe)

**Issue**: Template not found
**Solution**: Ensure the template exists in your DocuSeal account and is not archived

**Issue**: Webhook not triggering
**Solution**: Check that your n8n instance is publicly accessible and the webhook is properly registered

**Issue**: Documents not merging
**Solution**: Verify that all documents are valid PDFs or DOCX files and properly encoded

### Getting Help

If you encounter issues:

1. Check the [DocuSeal API documentation](https://www.docuseal.com/docs/api)
2. Visit the [n8n community forum](https://community.n8n.io/)
3. Open an issue on [GitHub](https://github.com/docusealco/n8n-nodes-docuseal/issues)

## Resources

- [DocuSeal Website](https://www.docuseal.com)
- [DocuSeal API Reference](https://www.docuseal.com/docs/api)
- [DocuSeal Webhooks Documentation](https://www.docuseal.com/docs/api#form-webhook)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Community Forum](https://community.n8n.io/)

## Support

- 📧 Email: support@docuseal.com
- 💬 Community: [n8n Community Forum](https://community.n8n.io/)
- 🐛 Issues: [GitHub Issues](https://github.com/docusealco/n8n-nodes-docuseal/issues)

## License

[MIT](https://github.com/docusealco/n8n-nodes-docuseal/blob/main/LICENSE.md)
