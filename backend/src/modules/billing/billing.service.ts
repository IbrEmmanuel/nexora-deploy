import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SubscriptionPlan } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2024-04-10',
    });
  }

  async createCheckoutSession(
    organizationId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) throw new BadRequestException('Organization not found');

    let customerId = org.stripeCustomerId;

    // Create Stripe customer if not exists
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        name: org.name,
        metadata: { organizationId },
      });
      customerId = customer.id;

      await this.prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { organizationId },
      subscription_data: {
        metadata: { organizationId },
      },
    });

    return { url: session.url, sessionId: session.id };
  }

  async createPortalSession(organizationId: string, returnUrl: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org?.stripeCustomerId) {
      throw new BadRequestException('No billing account found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err}`);
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        this.logger.log(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true };
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const organizationId = subscription.metadata.organizationId;
    if (!organizationId) return;

    const priceId = subscription.items.data[0]?.price.id;
    const plan = this.getPlanFromPriceId(priceId);

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        plan,
        subscriptionStatus: subscription.status.toUpperCase() as any,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
      },
    });

    this.logger.log(`Subscription updated for org ${organizationId}: ${plan}`);
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const organizationId = subscription.metadata.organizationId;
    if (!organizationId) return;

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { plan: 'FREE', subscriptionStatus: 'CANCELED' },
    });
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const org = await this.prisma.organization.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (org) {
      await this.prisma.organization.update({
        where: { id: org.id },
        data: { subscriptionStatus: 'PAST_DUE' },
      });
    }
  }

  private getPlanFromPriceId(priceId: string | undefined): SubscriptionPlan {
    const config = this.configService;
    if (!priceId) return SubscriptionPlan.FREE;
    if (
      priceId === config.get('STRIPE_PRICE_STARTER_MONTHLY') ||
      priceId === config.get('STRIPE_PRICE_STARTER_YEARLY')
    )
      return SubscriptionPlan.STARTER;
    if (
      priceId === config.get('STRIPE_PRICE_PRO_MONTHLY') ||
      priceId === config.get('STRIPE_PRICE_PRO_YEARLY')
    )
      return SubscriptionPlan.PRO;
    if (
      priceId === config.get('STRIPE_PRICE_ENTERPRISE_MONTHLY') ||
      priceId === config.get('STRIPE_PRICE_ENTERPRISE_YEARLY')
    )
      return SubscriptionPlan.ENTERPRISE;
    return SubscriptionPlan.FREE;
  }
}
