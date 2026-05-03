import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EnergyService } from './energy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('energy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get energy dashboard stats' })
  getDashboard(@CurrentUser('organizationId') orgId: string) {
    return this.energyService.getDashboardStats(orgId);
  }

  @Get('devices')
  @ApiOperation({ summary: 'List all energy devices' })
  getDevices(@CurrentUser('organizationId') orgId: string) {
    return this.energyService.getDevices(orgId);
  }

  @Post('devices')
  @ApiOperation({ summary: 'Register a new energy device' })
  createDevice(
    @Body() body: { name: string; deviceType: string; location?: string; latitude?: number; longitude?: number },
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.energyService.createDevice(orgId, body);
  }

  @Put('devices/:id/status')
  @ApiOperation({ summary: 'Update device status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.energyService.updateDeviceStatus(id, status);
  }

  @Post('devices/:id/readings')
  @ApiOperation({ summary: 'Submit a sensor reading' })
  addReading(
    @Param('id') deviceId: string,
    @Body() body: { metric: string; value: number; unit: string },
  ) {
    return this.energyService.addReading(deviceId, body.metric, body.value, body.unit);
  }

  @Get('devices/:id/readings')
  @ApiOperation({ summary: 'Get device readings' })
  getReadings(@Param('id') deviceId: string, @Query('hours') hours?: number) {
    return this.energyService.getReadings(deviceId, hours ?? 24);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get all alerts' })
  getAlerts(
    @CurrentUser('organizationId') orgId: string,
    @Query('includeResolved') includeResolved?: string,
  ) {
    return this.energyService.getAlerts(orgId, includeResolved === 'true');
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create an alert' })
  createAlert(@Body() body: { deviceId: string; severity: string; message: string }) {
    return this.energyService.createAlert(body.deviceId, body.severity, body.message);
  }

  @Put('alerts/:id/resolve')
  @ApiOperation({ summary: 'Resolve an alert' })
  resolveAlert(@Param('id') id: string) {
    return this.energyService.resolveAlert(id);
  }
}
