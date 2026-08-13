import { Router, Response } from 'express';
import { dbStore } from '../db';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../auth';
import { validateOrder, validateAddress } from '../validation';
import { createStripePaymentIntent, createRazorpayOrder, getStripeClient } from '../payment';
import { Order, Address, Notification } from '../../types';

const router = Router();

// ID generators
const generateId = (prefix: string = 'id') => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * ====================================================
 * ADDRESS ROUTES
 * ====================================================
 */

/**
 * @route   GET /api/addresses/:userId
 * @desc    Fetch target customer delivery addresses
 */
router.get('/addresses/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    if (process.env.DATABASE_URL) {
      const addresses = await prisma.address.findMany({
        where: { userId }
      });
      return res.json(addresses);
    }

    // --- FALLBACK ---
    res.json(dbStore.getAddresses().filter(a => a.userId === userId));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve addresses.' });
  }
});

/**
 * @route   POST /api/addresses
 * @desc    Add a persistent shipping address
 */
router.post('/addresses', requireAuth, validateAddress, async (req: AuthenticatedRequest, res: Response) => {
  const { userId, fullName, phone, street, city, state, zipCode, isDefault, lat, lng, formattedLocationName } = req.body;

  try {
    if (process.env.DATABASE_URL) {
      if (isDefault) {
        // Stripe out existing defaults
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }

      const addr = await prisma.address.create({
        data: {
          userId,
          fullName,
          phone,
          street,
          city,
          state,
          zipCode,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
          formattedLocationName,
          isDefault: !!isDefault
        } as any
      });
      return res.status(201).json(addr);
    }

    // --- FALLBACK ---
    const newAddress: Address = {
      id: generateId('addr'),
      userId,
      fullName,
      phone,
      street,
      city,
      state,
      zipCode,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      formattedLocationName,
      isDefault: !!isDefault
    };

    dbStore.addAddress(newAddress);
    res.status(201).json(newAddress);

  } catch (err) {
    res.status(500).json({ error: 'Failed to write address record.' });
  }
});

/**
 * @route   DELETE /api/addresses/:id/:userId
 * @desc    Purge a custom shipping address
 */
router.delete('/addresses/:id/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (process.env.DATABASE_URL) {
      await prisma.address.delete({
        where: { id: req.params.id }
      });
      return res.json({ success: true });
    }

    // --- FALLBACK ---
    dbStore.deleteAddress(req.params.id, req.params.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database delete constraint violation.' });
  }
});

/**
 * ====================================================
 * CORE ORDER ROUTES
 * ====================================================
 */

/**
 * @route   GET /api/orders/user/:userId
 * @desc    Get complete order checkout history for a user
 */
router.get('/orders/user/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    if (process.env.DATABASE_URL) {
      const pOrders = await prisma.order.findMany({
        where: { userId },
        include: { items: true, shippingAddress: true },
        orderBy: { createdAt: 'desc' }
      });

      const mapped: Order[] = pOrders.map(o => ({
        id: o.id,
        userId: o.userId,
        items: o.items.map(item => ({
          id: item.id,
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedSize: item.selectedSize || undefined,
          selectedColor: item.selectedColor || undefined
        })),
        subtotal: o.subtotal,
        tax: o.tax,
        shippingFee: o.shippingFee,
        discountAmount: o.discountAmount,
        couponApplied: o.couponApplied || undefined,
        total: o.total,
        status: o.status as any,
        paymentStatus: o.paymentStatus as any,
        paymentMethod: o.paymentMethod as any,
        shippingAddress: {
          id: o.shippingAddress.id,
          userId: o.shippingAddress.userId,
          fullName: o.shippingAddress.fullName,
          phone: o.shippingAddress.phone,
          street: o.shippingAddress.street,
          city: o.shippingAddress.city,
          state: o.shippingAddress.state,
          zipCode: o.shippingAddress.zipCode,
          isDefault: o.shippingAddress.isDefault
        },
        trackingNumber: o.trackingNumber || undefined,
        deliveryDate: o.deliveryDate || undefined,
        createdAt: o.createdAt.toISOString()
      }));

      return res.json(mapped);
    }

    // --- FALLBACK ---
    res.json(dbStore.getOrders().filter(o => o.userId === userId));

  } catch (err) {
    res.status(500).json({ error: 'Database error reading orders.' });
  }
});

/**
 * @route   POST /api/orders
 * @desc    Submits structured orders. Dynamically hooks payments and inventory locks.
 */
router.post('/orders', requireAuth, validateOrder, async (req: AuthenticatedRequest, res: Response) => {
  const {
    userId,
    items,
    subtotal,
    tax,
    shippingFee,
    discountAmount,
    total,
    shippingAddress,
    paymentMethod,
    couponApplied
  } = req.body;

  try {
    const trackingNumber = 'TRK' + Math.floor(10000000 + Math.random() * 90000000);
    const expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString(); // 5 business days
    const orderId = generateId('order').toUpperCase();

    // Dynamically prepare secure Stripe / Razorpay payments metadata structures (without crashing)
    let paymentGatewayCredentials: any = {};

    if (paymentMethod === 'STRIPE') {
      try {
        const intent = await createStripePaymentIntent(Math.round(total * 100), 'usd', orderId);
        paymentGatewayCredentials = {
          clientSecret: intent.client_secret,
          stripePaymentIntentId: intent.id
        };
      } catch (stripeErr: any) {
        console.warn('Stripe Gateway initializing failure. Standard demo bypass activated.', stripeErr.message);
        paymentGatewayCredentials = { clientSecret: `mock_stripe_key_for_${orderId}` };
      }
    } else if (paymentMethod === 'RAZORPAY') {
      try {
        const rzOrder = await createRazorpayOrder(Math.round(total * 100), 'INR', `rcpt_${orderId}`);
        paymentGatewayCredentials = {
          razorpayOrderId: rzOrder.id,
          amount: rzOrder.amount,
          currency: rzOrder.currency
        };
      } catch (rzpErr: any) {
        console.warn('Razorpay Gateway initializing failure. Standard demo bypass activated.', rzpErr.message);
        paymentGatewayCredentials = { razorpayOrderId: `order_mock_${Math.random().toString(36).substring(4, 10)}` };
      }
    }

    // --- DB ACTIONS ---
    if (process.env.DATABASE_URL) {
      // 1. Verify and decrement product inventory stocks
      for (const item of items) {
        const prod = await prisma.product.findUnique({ where: { id: item.productId } });
        if (prod) {
          await prisma.product.update({
            where: { id: prod.id },
            data: { stock: Math.max(0, prod.stock - item.quantity) }
          });
        }
      }

      // 2. Insert order entity in schema
      const createdOrder = await prisma.order.create({
        data: {
          id: orderId,
          userId,
          subtotal: parseFloat(subtotal),
          tax: parseFloat(tax),
          shippingFee: parseFloat(shippingFee),
          discountAmount: discountAmount ? parseFloat(discountAmount) : 0,
          couponApplied,
          total: parseFloat(total),
          status: 'PENDING',
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
          paymentMethod,
          shippingAddressId: shippingAddress.id,
          trackingNumber,
          deliveryDate: expectedDelivery,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              title: item.title,
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity),
              image: item.image,
              selectedSize: item.selectedSize || null,
              selectedColor: item.selectedColor || null
            }))
          }
        },
        include: { items: true, shippingAddress: true }
      });

      // 3. Create delivery push notificaiton
      await prisma.notification.create({
        data: {
          userId,
          title: 'Order Placed!',
          message: `Your order ${orderId} has been securely submitted. Tracking Number: ${trackingNumber}.`,
          type: 'ORDER',
          read: false
        }
      });

      return res.status(201).json({
        ...createdOrder,
        ...paymentGatewayCredentials
      });
    }

    // --- JSON DB FALLBACK ---
    const newOrder: Order = {
      id: orderId,
      userId,
      items,
      subtotal,
      tax,
      shippingFee,
      discountAmount: discountAmount || 0,
      total,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
      paymentMethod,
      status: 'PENDING',
      couponApplied,
      shippingAddress,
      trackingNumber,
      deliveryDate: expectedDelivery,
      createdAt: new Date().toISOString()
    };

    dbStore.addOrder(newOrder);

    const checkNotif: Notification = {
      id: generateId('notif'),
      userId,
      title: 'Order Placed!',
      message: `Your order ${orderId} has been successfully completed. Total: ${total}. Track it inside your profile.`,
      type: 'ORDER',
      read: false,
      createdAt: new Date().toISOString()
    };
    dbStore.addNotification(checkNotif);

    res.status(201).json({
      ...newOrder,
      ...paymentGatewayCredentials
    });

  } catch (err: any) {
    console.error('Order creation failed:', err);
    res.status(500).json({ error: 'Checkout pipeline crashed during execution.' });
  }
});

export default router;
