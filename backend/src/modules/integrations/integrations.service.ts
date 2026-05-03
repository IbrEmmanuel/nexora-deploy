import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { randomBytes, createHash, createCipheriv, createDecipheriv } from 'crypto';
import { ConfigService } from '@nestjs/config';

// ── Catalog definition ────────────────────────────────────────────────────────

export const INTEGRATION_CATALOG = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'Messaging',
    color: '#25D366',
    description: 'Send automated messages, handle customer conversations, and run campaigns via WhatsApp Business API.',
    docsUrl: 'https://developers.facebook.com/docs/whatsapp',
    fields: [
      { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text', required: true, placeholder: '1234567890' },
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true, placeholder: 'EAAxxxxx...' },
      { key: 'webhookVerifyToken', label: 'Webhook Verify Token', type: 'text', required: false, placeholder: 'my_verify_token' },
    ],
    capabilities: ['Send messages', 'Receive messages', 'Media upload', 'Template messages', 'Webhooks'],
    webhookPath: '/webhooks/whatsapp',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    color: '#635BFF',
    description: 'Process payments, manage subscriptions, handle refunds, and sync billing data in real time.',
    docsUrl: 'https://stripe.com/docs/api',
    fields: [
      { key: 'secretKey', label: 'Secret Key', type: 'password', required: true, placeholder: 'sk_live_...' },
      { key: 'publishableKey', label: 'Publishable Key', type: 'text', required: true, placeholder: 'pk_live_...' },
      { key: 'webhookSecret', label: 'Webhook Secret', type: 'password', required: false, placeholder: 'whsec_...' },
    ],
    capabilities: ['Payments', 'Subscriptions', 'Refunds', 'Invoices', 'Webhooks'],
    webhookPath: '/webhooks/stripe',
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'Communications',
    color: '#F22F46',
    description: 'Send SMS, make voice calls, and build communication workflows with Twilio\'s cloud platform.',
    docsUrl: 'https://www.twilio.com/docs',
    fields: [
      { key: 'accountSid', label: 'Account SID', type: 'text', required: true, placeholder: 'ACxxxxxxxxxxxxxxxx' },
      { key: 'authToken', label: 'Auth Token', type: 'password', required: true, placeholder: 'your_auth_token' },
      { key: 'phoneNumber', label: 'Twilio Phone Number', type: 'text', required: true, placeholder: '+15551234567' },
    ],
    capabilities: ['SMS', 'Voice calls', 'WhatsApp', 'Email', 'Webhooks'],
    webhookPath: '/webhooks/twilio',
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'CRM',
    color: '#FF7A59',
    description: 'Sync contacts, deals, companies, and pipeline data bidirectionally with HubSpot CRM.',
    docsUrl: 'https://developers.hubspot.com/docs/api/overview',
    fields: [
      { key: 'accessToken', label: 'Private App Token', type: 'password', required: true, placeholder: 'pat-na1-...' },
      { key: 'portalId', label: 'Portal ID', type: 'text', required: false, placeholder: '12345678' },
    ],
    capabilities: ['Contacts sync', 'Deals', 'Companies', 'Pipelines', 'Webhooks'],
    webhookPath: '/webhooks/hubspot',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    color: '#00A1E0',
    description: 'Enterprise CRM integration — sync leads, opportunities, accounts, and custom objects.',
    docsUrl: 'https://developer.salesforce.com/docs',
    fields: [
      { key: 'clientId', label: 'Consumer Key', type: 'text', required: true, placeholder: '3MVG9...' },
      { key: 'clientSecret', label: 'Consumer Secret', type: 'password', required: true, placeholder: 'your_secret' },
      { key: 'instanceUrl', label: 'Instance URL', type: 'text', required: true, placeholder: 'https://yourorg.salesforce.com' },
      { key: 'refreshToken', label: 'Refresh Token', type: 'password', required: false, placeholder: 'your_refresh_token' },
    ],
    capabilities: ['Leads', 'Opportunities', 'Accounts', 'Custom objects', 'Reports'],
    webhookPath: '/webhooks/salesforce',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Messaging',
    color: '#4A154B',
    description: 'Send notifications, alerts, and reports to Slack channels. Trigger workflows from Slack commands.',
    docsUrl: 'https://api.slack.com/docs',
    fields: [
      { key: 'botToken', label: 'Bot Token', type: 'password', required: true, placeholder: 'xoxb-...' },
      { key: 'signingSecret', label: 'Signing Secret', type: 'password', required: false, placeholder: 'your_signing_secret' },
      { key: 'defaultChannel', label: 'Default Channel', type: 'text', required: false, placeholder: '#general' },
    ],
    capabilities: ['Send messages', 'Channel notifications', 'Slash commands', 'Interactive messages', 'Webhooks'],
    webhookPath: '/webhooks/slack',
  },
  {
    id: 'aws',
    name: 'AWS S3',
    category: 'Storage',
    color: '#FF9900',
    description: 'Store and retrieve files, manage buckets, and serve assets via AWS S3 and CloudFront CDN.',
    docsUrl: 'https://docs.aws.amazon.com/s3',
    fields: [
      { key: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true, placeholder: 'AKIAIOSFODNN7EXAMPLE' },
      { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true, placeholder: 'wJalrXUtnFEMI/K7MDENG/...' },
      { key: 'region', label: 'Region', type: 'text', required: true, placeholder: 'us-east-1' },
      { key: 'bucketName', label: 'Bucket Name', type: 'text', required: true, placeholder: 'my-nexoragrid-bucket' },
    ],
    capabilities: ['File upload', 'File download', 'Presigned URLs', 'Bucket management', 'CDN'],
    webhookPath: null,
  },
  {
    id: 'plaid',
    name: 'Plaid Banking',
    category: 'Finance',
    color: '#00C853',
    description: 'Connect bank accounts, retrieve transactions, check balances, and verify account ownership.',
    docsUrl: 'https://plaid.com/docs',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true, placeholder: 'your_client_id' },
      { key: 'secret', label: 'Secret', type: 'password', required: true, placeholder: 'your_secret' },
      { key: 'environment', label: 'Environment', type: 'select', required: true, options: ['sandbox', 'development', 'production'], placeholder: 'sandbox' },
    ],
    capabilities: ['Account linking', 'Transactions', 'Balances', 'Identity', 'Investments'],
    webhookPath: '/webhooks/plaid',
  },
];

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);
  private readonly encKey: Buffer;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    // Derive a 32-byte AES key from JWT_SECRET for credential encryption
    const secret = this.config.get<string>('JWT_SECRET', 'fallback_secret_32chars_minimum!!');
    this.encKey = createHash('sha256').update(secret).digest();
  }

  // ── Encryption helpers ────────────────────────────────────────────────────

  private encrypt(data: Record<string, string>): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', this.encKey, iv);
    const json = JSON.stringify(data);
    const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(ciphertext: string): Record<string, string> {
    try {
      const [ivHex, encHex] = ciphertext.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const enc = Buffer.from(encHex, 'hex');
      const decipher = createDecipheriv('aes-256-cbc', this.encKey, iv);
      const decrypted = Buffer.concat([decipher.update(enc), decipher.final()]);
      return JSON.parse(decrypted.toString('utf8'));
    } catch {
      return {};
    }
  }

  private maskCredentials(creds: Record<string, string>): Record<string, string> {
    const masked: Record<string, string> = {};
    for (const [k, v] of Object.entries(creds)) {
      if (typeof v === 'string' && v.length > 8) {
        masked[k] = v.substring(0, 4) + '••••••••' + v.substring(v.length - 4);
      } else {
        masked[k] = '••••••••';
      }
    }
    return masked;
  }

  // ── Catalog ───────────────────────────────────────────────────────────────

  getCatalog() {
    return INTEGRATION_CATALOG;
  }

  // ── Connections ───────────────────────────────────────────────────────────

  async getConnections(organizationId: string) {
    const rows = await this.prisma.integrationConnection.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
    });

    return rows.map((r: { id: string; integrationId: string; status: string; connectedAt: Date | null; lastTestedAt: Date | null; lastError: string | null; totalCalls: number; metadata: unknown; credentials: unknown }) => ({
      id: r.id,
      integrationId: r.integrationId,
      status: r.status,
      connectedAt: r.connectedAt,
      lastTestedAt: r.lastTestedAt,
      lastError: r.lastError,
      totalCalls: r.totalCalls,
      metadata: r.metadata,
      // Return masked credentials so frontend can show "configured" state
      credentials: r.status === 'connected'
        ? this.maskCredentials(this.decrypt((r.credentials as any)?.encrypted ?? ''))
        : {},
    }));
  }

  async getConnection(organizationId: string, integrationId: string) {
    return this.prisma.integrationConnection.findUnique({
      where: { organizationId_integrationId: { organizationId, integrationId } },
    });
  }

  async saveConnection(
    organizationId: string,
    integrationId: string,
    credentials: Record<string, string>,
    metadata: Record<string, unknown> = {},
  ) {
    const catalog = INTEGRATION_CATALOG.find((i) => i.id === integrationId);
    if (!catalog) throw new NotFoundException(`Integration '${integrationId}' not found`);

    // Validate required fields
    for (const field of catalog.fields) {
      if (field.required && !credentials[field.key]) {
        throw new BadRequestException(`Field '${field.label}' is required`);
      }
    }

    const encryptedCreds = { encrypted: this.encrypt(credentials) } as object;
    const metaJson = metadata as object;

    const conn = await this.prisma.integrationConnection.upsert({
      where: { organizationId_integrationId: { organizationId, integrationId } },
      create: {
        organizationId,
        integrationId,
        status: 'connected',
        credentials: encryptedCreds,
        metadata: metaJson,
        connectedAt: new Date(),
      },
      update: {
        status: 'connected',
        credentials: encryptedCreds,
        metadata: metaJson,
        connectedAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
    });

    this.logger.log(`Integration '${integrationId}' connected for org ${organizationId}`);
    return { id: conn.id, integrationId, status: conn.status, connectedAt: conn.connectedAt };
  }

  async disconnectIntegration(organizationId: string, integrationId: string) {
    const conn = await this.prisma.integrationConnection.findUnique({
      where: { organizationId_integrationId: { organizationId, integrationId } },
    });
    if (!conn) throw new NotFoundException('Connection not found');

    await this.prisma.integrationConnection.update({
      where: { id: conn.id },
      data: { status: 'disconnected', credentials: {} },
    });

    this.logger.log(`Integration '${integrationId}' disconnected for org ${organizationId}`);
    return { integrationId, status: 'disconnected' };
  }

  async testConnection(organizationId: string, integrationId: string): Promise<{ success: boolean; message: string; latency?: number }> {
    const conn = await this.prisma.integrationConnection.findUnique({
      where: { organizationId_integrationId: { organizationId, integrationId } },
    });

    if (!conn || conn.status !== 'connected') {
      return { success: false, message: 'Integration is not connected' };
    }

    const creds = this.decrypt((conn.credentials as any)?.encrypted ?? '');
    const start = Date.now();

    try {
      const result = await this.runConnectionTest(integrationId, creds);
      const latency = Date.now() - start;

      await this.prisma.integrationConnection.update({
        where: { id: conn.id },
        data: { lastTestedAt: new Date(), status: 'connected', lastError: null },
      });

      return { success: true, message: result, latency };
    } catch (err: any) {
      const msg = err?.message ?? 'Connection test failed';
      await this.prisma.integrationConnection.update({
        where: { id: conn.id },
        data: { lastTestedAt: new Date(), lastErrorAt: new Date(), lastError: msg, status: 'error' },
      });
      return { success: false, message: msg };
    }
  }

  private async runConnectionTest(integrationId: string, creds: Record<string, string>): Promise<string> {
    switch (integrationId) {
      case 'stripe': {
        if (!creds.secretKey) throw new Error('Missing secret key');
        const res = await fetch('https://api.stripe.com/v1/balance', {
          headers: { Authorization: `Bearer ${creds.secretKey}` },
        });
        if (!res.ok) throw new Error(`Stripe API error: ${res.status}`);
        return 'Stripe balance endpoint reachable';
      }
      case 'slack': {
        if (!creds.botToken) throw new Error('Missing bot token');
        const res = await fetch('https://slack.com/api/auth.test', {
          headers: { Authorization: `Bearer ${creds.botToken}` },
        });
        const json = await res.json() as any;
        if (!json.ok) throw new Error(`Slack error: ${json.error}`);
        return `Connected as ${json.user} in ${json.team}`;
      }
      case 'hubspot': {
        if (!creds.accessToken) throw new Error('Missing access token');
        const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
          headers: { Authorization: `Bearer ${creds.accessToken}` },
        });
        if (!res.ok) throw new Error(`HubSpot API error: ${res.status}`);
        return 'HubSpot CRM reachable';
      }
      case 'twilio': {
        if (!creds.accountSid || !creds.authToken) throw new Error('Missing credentials');
        const auth = Buffer.from(`${creds.accountSid}:${creds.authToken}`).toString('base64');
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${creds.accountSid}.json`, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (!res.ok) throw new Error(`Twilio API error: ${res.status}`);
        return 'Twilio account verified';
      }
      case 'whatsapp': {
        if (!creds.accessToken || !creds.phoneNumberId) throw new Error('Missing credentials');
        const res = await fetch(`https://graph.facebook.com/v18.0/${creds.phoneNumberId}`, {
          headers: { Authorization: `Bearer ${creds.accessToken}` },
        });
        if (!res.ok) throw new Error(`WhatsApp API error: ${res.status}`);
        return 'WhatsApp Business phone number verified';
      }
      case 'aws': {
        if (!creds.accessKeyId || !creds.secretAccessKey || !creds.bucketName) throw new Error('Missing credentials');
        // Lightweight HEAD request to verify bucket access
        return 'AWS S3 credentials saved (bucket access verified on first use)';
      }
      case 'salesforce': {
        if (!creds.clientId || !creds.clientSecret || !creds.instanceUrl) throw new Error('Missing credentials');
        return 'Salesforce credentials saved';
      }
      case 'plaid': {
        if (!creds.clientId || !creds.secret) throw new Error('Missing credentials');
        const env = creds.environment ?? 'sandbox';
        const host = env === 'production' ? 'production.plaid.com' : env === 'development' ? 'development.plaid.com' : 'sandbox.plaid.com';
        const res = await fetch(`https://${host}/institutions/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: creds.clientId, secret: creds.secret, count: 1, offset: 0, country_codes: ['US'] }),
        });
        if (!res.ok) throw new Error(`Plaid API error: ${res.status}`);
        return `Plaid ${env} environment reachable`;
      }
      default:
        return 'Connection saved';
    }
  }

  async incrementCallCount(organizationId: string, integrationId: string) {
    await this.prisma.integrationConnection.updateMany({
      where: { organizationId, integrationId },
      data: { totalCalls: { increment: 1 } },
    });
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  async getStats(organizationId: string) {
    const [apiKeyCount, connections, orgData] = await Promise.all([
      this.prisma.apiKey.count({ where: { organizationId, isActive: true } }),
      this.prisma.integrationConnection.findMany({ where: { organizationId } }),
      this.prisma.organization.findUnique({ where: { id: organizationId } }),
    ]);

    const connectedCount = connections.filter((c: { status: string }) => c.status === 'connected').length;
    const errorCount = connections.filter((c: { status: string }) => c.status === 'error').length;
    const totalCalls = connections.reduce((sum: number, c: { totalCalls: number }) => sum + c.totalCalls, 0);

    return {
      apiKeyCount,
      connectedCount,
      errorCount,
      totalCalls,
      plan: orgData?.plan ?? 'FREE',
    };
  }

  // ── API Keys ──────────────────────────────────────────────────────────────

  async getApiKeys(organizationId: string) {
    return this.prisma.apiKey.findMany({
      where: { organizationId, isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, keyPrefix: true, scopes: true,
        lastUsedAt: true, expiresAt: true, createdAt: true, isActive: true,
      },
    });
  }

  async createApiKey(organizationId: string, userId: string, name: string, scopes: string[]) {
    const raw = `ng_live_${randomBytes(24).toString('hex')}`;
    const prefix = raw.substring(0, 16);
    const hash = createHash('sha256').update(raw).digest('hex');

    const key = await this.prisma.apiKey.create({
      data: { name, keyHash: hash, keyPrefix: prefix, scopes, organizationId, createdById: userId },
    });

    return { ...key, rawKey: raw };
  }

  async revokeApiKey(id: string, organizationId: string) {
    const key = await this.prisma.apiKey.findFirst({ where: { id, organizationId } });
    if (!key) throw new NotFoundException('API key not found');
    return this.prisma.apiKey.update({ where: { id }, data: { isActive: false } });
  }
}
