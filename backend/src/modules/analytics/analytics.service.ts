import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyticsEvent, AnalyticsEventDocument } from './schemas/analytics-event.schema';

export interface TrackEventDto {
  eventType: string;
  eventName: string;
  properties?: Record<string, unknown>;
  context?: Record<string, unknown>;
  sessionId?: string;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly mongoAvailable: boolean;

  constructor(
    @Optional()
    @InjectModel(AnalyticsEvent.name)
    private readonly eventModel: Model<AnalyticsEventDocument> | null,
  ) {
    this.mongoAvailable = !!eventModel;
    if (!this.mongoAvailable) {
      this.logger.warn('MongoDB unavailable — analytics tracking disabled');
    }
  }

  async track(organizationId: string, userId: string, dto: TrackEventDto): Promise<void> {
    if (!this.mongoAvailable || !this.eventModel) return;
    try {
      await this.eventModel.create({
        organizationId,
        userId,
        eventType: dto.eventType,
        eventName: dto.eventName,
        properties: dto.properties ?? {},
        context: dto.context ?? {},
        sessionId: dto.sessionId,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.warn('Failed to track event (MongoDB degraded)');
    }
  }

  async getEventCounts(organizationId: string, eventType: string, startDate: Date, endDate: Date) {
    if (!this.mongoAvailable || !this.eventModel) return [];
    try {
      return await this.eventModel.aggregate([
        { $match: { organizationId, eventType, timestamp: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);
    } catch { return []; }
  }

  async getTopEvents(organizationId: string, limit: number | string = 10) {
    if (!this.mongoAvailable || !this.eventModel) return [];
    const safeLimit = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 10));
    try {
      return await this.eventModel.aggregate([
        { $match: { organizationId } },
        { $group: { _id: '$eventName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: safeLimit },
      ]);
    } catch { return []; }
  }

  async getActiveUsers(organizationId: string, days: number | string = 30) {
    if (!this.mongoAvailable || !this.eventModel) return [];
    const safeDays = Math.max(1, parseInt(String(days), 10) || 30);
    const since = new Date();
    since.setDate(since.getDate() - safeDays);
    try {
      return await this.eventModel.distinct('userId', { organizationId, timestamp: { $gte: since } });
    } catch { return []; }
  }
}
