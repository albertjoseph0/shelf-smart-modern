import Stripe from 'stripe';
import { updateAccountWithStripeInfo } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer as string;

      console.log(`Checkout session completed for userId: ${userId}`);

      if (!userId || !stripeCustomerId) {
        console.error('Webhook Error: userId or customerId missing from checkout session completed event');
        return NextResponse.json({ error: 'Missing userId or customerId in session' }, { status: 400 });
      }

      try {
        // Retrieve the session with line_items expanded
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ['line_items'],
          }
        );

        // Extract the Price ID from the first line item
        const lineItem = sessionWithLineItems.line_items?.data[0];
        const priceId = lineItem?.price?.id;

        if (!priceId) {
            console.error(`Webhook Error: Price ID missing from line items for session ${session.id}`);
            return NextResponse.json({ error: 'Price ID missing from line items' }, { status: 400 });
        }

        // Determine package name based on Price ID
        let packageName: string;
        switch (priceId) {
            case process.env.STRIPE_STARTER_SUB:
                packageName = 'Starter';
                break;
            case process.env.STRIPE_SCHOLAR_SUB:
                packageName = 'Scholar';
                break;
            case process.env.STRIPE_SAVANT_SUB:
                packageName = 'Savant';
                break;
            default:
                console.warn(`Webhook Warning: Unrecognized Price ID ${priceId} for session ${session.id}`);
                packageName = 'Unknown'; // Assign a default or handle as an error
        }
        
        const status = 'ACTIVE';

        console.log(`Attempting to update DB for userId: ${userId} with StripeCustomerId: ${stripeCustomerId}, Package: ${packageName}`);
        await updateAccountWithStripeInfo(userId, stripeCustomerId, packageName, status);
        console.log(`DB update successful for userId: ${userId}`);
      } catch (error) { // Catch errors from Stripe API call or DB update
        console.error(`Webhook Error processing checkout.session.completed for userId ${userId}:`, error);
        // Decide if this error should return 500 or still 200 to Stripe
        // Returning 500 might cause Stripe to retry the webhook.
        // Returning 200 acknowledges receipt even if processing failed.
        // Let's return 500 for unexpected processing errors.
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
      }
      break;
    }
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      const stripeCustomerId = subscription.customer as string;
      const status = subscription.status;

      console.log(`Subscription created/updated for userId: ${userId}, Status: ${status}`);
      if (userId) {
        console.log(`DB update placeholder called for userId: ${userId}`);
      }
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      const status = subscription.status;
      
      console.log(`Subscription updated for userId: ${userId}, Status: ${status}`);
      if (userId) {
        console.log(`DB update placeholder called for userId: ${userId}`);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      console.log(`Subscription deleted for userId: ${userId}`);
      if (userId) {
        console.log(`DB update placeholder called for userId: ${userId}`);
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}