import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy loading configurations to meet the key guidelines
let stripeClient: Stripe | null = null;
let razorpayClient: Razorpay | null = null;

/**
 * Lazily fetches and instantiates the Stripe Client
 */
export const getStripeClient = (): Stripe => {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not defined in current environment settings.');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2025-01-27' as any, // Latest safe API version
    });
  }
  return stripeClient;
};

/**
 * Lazily fetches and instantiates the Razorpay Client
 */
export const getRazorpayClient = (): Razorpay => {
  if (!razorpayClient) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment settings.');
    }
    // Initialize Razorpay SDK client
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayClient;
};

/**
 * STRIPE INTEGRATION ENGINES
 */
export const createStripePaymentIntent = async (amountInCents: number, currency: string = 'usd', orderId: string) => {
  const stripe = getStripeClient();
  return stripe.paymentIntents.create({
    amount: amountInCents,
    currency,
    metadata: { orderId },
    automatic_payment_methods: { enabled: true }
  });
};

export const verifyStripeWebhook = (payload: string | Buffer, signature: string, secret: string) => {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, secret);
};

/**
 * RAZORPAY INTEGRATION ENGINES
 */
export const createRazorpayOrder = async (amountInPaise: number, currency: string = 'INR', receiptId: string): Promise<any> => {
  const rzp = getRazorpayClient();
  return rzp.orders.create({
    amount: amountInPaise,
    currency,
    receipt: receiptId,
    payment_capture: true
  }) as any;
};

/**
 * Validates Razorpay client-side signatures in absolute compliance with Razorpay API standards
 */
export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string): boolean => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error('RAZORPAY_KEY_SECRET is missing. Cannot verify authentic checksum signature.');
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
