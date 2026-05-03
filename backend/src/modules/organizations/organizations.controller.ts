import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current organization' })
  getCurrent(@CurrentUser('organizationId') organizationId: string) {
    return this.organizationsService.findById(organizationId);
  }

  @Patch('current')
  @ApiOperation({ summary: 'Update current organization' })
  updateCurrent(
    @CurrentUser('organizationId') organizationId: string,
    @Body() body: { name?: string; website?: string; logoUrl?: string; industry?: string },
  ) {
    return this.organizationsService.update(organizationId, body);
  }

  @Get('current/usage')
  @ApiOperation({ summary: 'Get organization usage metrics' })
  getUsage(@CurrentUser('organizationId') organizationId: string) {
    return this.organizationsService.getUsageMetrics(organizationId);
  }

  @Get('current/dashboard')
  @ApiOperation({ summary: 'Full dashboard stats — metrics, agents, activity, health' })
  getDashboard(@CurrentUser('organizationId') organizationId: string) {
    return this.organizationsService.getDashboardStats(organizationId);
  }

  @Get('current/financial')
  @ApiOperation({ summary: 'Financial intelligence — monthly growth, totals' })
  getFinancial(@CurrentUser('organizationId') organizationId: string) {
    return this.organizationsService.getFinancialStats(organizationId);
  }

  @Get('current/reports')
  @ApiOperation({ summary: 'Full organization report — all entities' })
  getReports(@CurrentUser('organizationId') organizationId: string) {
    return this.organizationsService.getReports(organizationId);
  }
}
