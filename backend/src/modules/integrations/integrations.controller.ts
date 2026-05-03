import {
  Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  // ── Stats ─────────────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get integrations stats' })
  getStats(@CurrentUser('organizationId') orgId: string) {
    return this.integrationsService.getStats(orgId);
  }

  // ── Catalog ───────────────────────────────────────────────────────────────

  @Get('catalog')
  @ApiOperation({ summary: 'Get available integrations catalog' })
  getCatalog() {
    return this.integrationsService.getCatalog();
  }

  // ── Connections ───────────────────────────────────────────────────────────

  @Get('connections')
  @ApiOperation({ summary: 'Get all integration connections for the org' })
  getConnections(@CurrentUser('organizationId') orgId: string) {
    return this.integrationsService.getConnections(orgId);
  }

  @Post('connections/:integrationId/save')
  @ApiOperation({ summary: 'Save/update credentials for an integration' })
  saveConnection(
    @Param('integrationId') integrationId: string,
    @CurrentUser('organizationId') orgId: string,
    @Body() body: { credentials: Record<string, string>; metadata?: Record<string, unknown> },
  ) {
    return this.integrationsService.saveConnection(orgId, integrationId, body.credentials, body.metadata);
  }

  @Post('connections/:integrationId/disconnect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disconnect an integration' })
  disconnect(
    @Param('integrationId') integrationId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.integrationsService.disconnectIntegration(orgId, integrationId);
  }

  @Post('connections/:integrationId/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test an integration connection' })
  testConnection(
    @Param('integrationId') integrationId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.integrationsService.testConnection(orgId, integrationId);
  }

  // ── API Keys ──────────────────────────────────────────────────────────────

  @Get('api-keys')
  @ApiOperation({ summary: 'List API keys' })
  getApiKeys(@CurrentUser('organizationId') orgId: string) {
    return this.integrationsService.getApiKeys(orgId);
  }

  @Post('api-keys')
  @ApiOperation({ summary: 'Generate a new API key' })
  createApiKey(
    @Body() body: { name: string; scopes: string[] },
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.integrationsService.createApiKey(orgId, userId, body.name, body.scopes ?? ['read']);
  }

  @Delete('api-keys/:id')
  @ApiOperation({ summary: 'Revoke an API key' })
  revokeApiKey(@Param('id') id: string, @CurrentUser('organizationId') orgId: string) {
    return this.integrationsService.revokeApiKey(id, orgId);
  }
}
