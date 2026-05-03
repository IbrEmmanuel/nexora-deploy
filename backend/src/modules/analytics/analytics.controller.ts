import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService, TrackEventDto } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track an analytics event' })
  async track(
    @Body() dto: TrackEventDto,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.analyticsService.track(organizationId, userId, dto);
    return { tracked: true };
  }

  @Get('events/counts')
  @ApiOperation({ summary: 'Get event counts over time' })
  async getEventCounts(
    @CurrentUser('organizationId') organizationId: string,
    @Query('eventType') eventType: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getEventCounts(
      organizationId,
      eventType,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('events/top')
  @ApiOperation({ summary: 'Get top events' })
  async getTopEvents(
    @CurrentUser('organizationId') organizationId: string,
    @Query('limit') limit?: number,
  ) {
    return this.analyticsService.getTopEvents(organizationId, limit);
  }

  @Get('users/active')
  @ApiOperation({ summary: 'Get active user count' })
  async getActiveUsers(
    @CurrentUser('organizationId') organizationId: string,
    @Query('days') days?: number,
  ) {
    const users = await this.analyticsService.getActiveUsers(organizationId, days);
    return { count: users.length, days: days ?? 30 };
  }
}
