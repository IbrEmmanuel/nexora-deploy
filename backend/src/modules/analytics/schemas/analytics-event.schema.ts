import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsEventDocument = AnalyticsEvent & Document;

@Schema({ timestamps: true, collection: 'analytics_events' })
export class AnalyticsEvent {
  @Prop({ required: true, index: true })
  organizationId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  eventType: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ type: Object, default: {} })
  properties: Record<string, unknown>;

  @Prop({ type: Object, default: {} })
  context: {
    ip?: string;
    userAgent?: string;
    page?: string;
    referrer?: string;
    sessionId?: string;
  };

  @Prop({ index: true })
  sessionId: string;

  @Prop({ default: Date.now, index: true })
  timestamp: Date;
}

export const AnalyticsEventSchema = SchemaFactory.createForClass(AnalyticsEvent);

// Compound indexes for common queries
AnalyticsEventSchema.index({ organizationId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ organizationId: 1, eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ organizationId: 1, userId: 1, timestamp: -1 });
