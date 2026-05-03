import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class EnergyService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevices(organizationId: string) {
    return this.prisma.energyDevice.findMany({
      where: { organizationId },
      include: {
        alerts: { where: { resolved: false }, orderBy: { createdAt: 'desc' }, take: 3 },
        readings: { orderBy: { timestamp: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDevice(organizationId: string, data: {
    name: string; deviceType: string; location?: string;
    latitude?: number; longitude?: number; metadata?: Record<string, unknown>;
  }) {
    return this.prisma.energyDevice.create({
      data: {
        name: data.name,
        deviceType: data.deviceType as any,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        metadata: (data.metadata ?? {}) as any,
        organizationId,
        status: 'ONLINE',
      },
    });
  }

  async updateDeviceStatus(id: string, status: string) {
    const device = await this.prisma.energyDevice.findUnique({ where: { id } });
    if (!device) throw new NotFoundException('Device not found');
    return this.prisma.energyDevice.update({
      where: { id },
      data: { status: status as any, lastSeenAt: new Date() },
    });
  }

  async addReading(deviceId: string, metric: string, value: number, unit: string) {
    const device = await this.prisma.energyDevice.findUnique({ where: { id: deviceId } });
    if (!device) throw new NotFoundException('Device not found');
    const reading = await this.prisma.energyReading.create({
      data: { deviceId, metric, value, unit, timestamp: new Date() },
    });
    await this.prisma.energyDevice.update({
      where: { id: deviceId },
      data: { lastSeenAt: new Date() },
    });
    return reading;
  }

  async getReadings(deviceId: string, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.prisma.energyReading.findMany({
      where: { deviceId, timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
    });
  }

  async getAlerts(organizationId: string, includeResolved = false) {
    return this.prisma.energyAlert.findMany({
      where: {
        device: { organizationId },
        ...(includeResolved ? {} : { resolved: false }),
      },
      include: { device: { select: { id: true, name: true, deviceType: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async createAlert(deviceId: string, severity: string, message: string) {
    return this.prisma.energyAlert.create({
      data: { deviceId, severity, message },
    });
  }

  async resolveAlert(alertId: string) {
    return this.prisma.energyAlert.update({
      where: { id: alertId },
      data: { resolved: true, resolvedAt: new Date() },
    });
  }

  async getDashboardStats(organizationId: string) {
    const devices = await this.prisma.energyDevice.findMany({
      where: { organizationId },
      include: {
        readings: { orderBy: { timestamp: 'desc' }, take: 1 },
        alerts: { where: { resolved: false } },
      },
    });

    const total = devices.length;
    const online = devices.filter((d: { status: string }) => d.status === 'ONLINE').length;
    const warnings = devices.filter((d: { status: string }) => d.status === 'WARNING').length;
    const faults = devices.filter((d: { status: string }) => d.status === 'FAULT').length;
    const totalAlerts = devices.reduce((s: number, d: { alerts: unknown[] }) => s + d.alerts.length, 0);

    const byType = devices.reduce((acc: Record<string, number>, d: { deviceType: string }) => {
      acc[d.deviceType] = (acc[d.deviceType] ?? 0) + 1;
      return acc;
    }, {});

    return { total, online, warnings, faults, totalAlerts, byType, devices };
  }
}
