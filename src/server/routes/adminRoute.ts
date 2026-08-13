import { Router, Response } from 'express';
import { dbStore } from '../db';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest, requireRole } from '../auth';
import { Coupon, Notification } from '../../types';

const router = Router();

// ID generator
const generateId = (prefix: string = 'id') => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * @route   GET /api/admin/stats
 * @desc    Fetch system wide metric summary stats (Users, sellers, revenues, orders count)
 */
router.get('/stats', requireAuth, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (process.env.DATABASE_URL) {
      const usersCount = await prisma.user.count();
      const productsCount = await prisma.product.count();
      const ordersCount = await prisma.order.count();
      const sellersCount = await prisma.seller.count();

      const activeOrders = await prisma.order.findMany({
        where: {
          NOT: {
            status: { in: ['CANCELLED', 'RETURNED'] }
          }
        },
        select: { total: true }
      });

      const revenueSum = activeOrders.reduce((acc, order) => acc + order.total, 0);

      return res.json({
        totalUsers: usersCount,
        totalProducts: productsCount,
        totalOrders: ordersCount,
        totalSellers: sellersCount,
        revenue: revenueSum
      });
    }

    // --- FALLBACK ---
    const users = dbStore.getUsers();
    const products = dbStore.getProducts();
    const orders = dbStore.getOrders();
    const sellers = dbStore.getSellers();

    const revenue = orders
      .filter(o => o.status !== 'CANCELLED' && o.status !== 'RETURNED')
      .reduce((acc, o) => acc + o.total, 0);

    res.json({
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalSellers: sellers.length,
      revenue
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to access system analytics schema.' });
  }
});

/**
 * @route   GET /api/admin/sellers
 * @desc    Fetch lists of merchants onboarded in the system
 */
router.get('/sellers', requireAuth, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (process.env.DATABASE_URL) {
      const sellers = await prisma.seller.findMany({
        orderBy: { joinedAt: 'desc' }
      });
      return res.json(sellers);
    }

    // --- FALLBACK ---
    res.json(dbStore.getSellers());
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve sellers index.' });
  }
});

/**
 * @route   PATCH /api/admin/sellers/:id/kyc
 * @desc    Audit or override Seller store approval credentials
 */
router.patch('/sellers/:id/kyc', requireAuth, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'APPROVED' | 'REJECTED'

  try {
    if (process.env.DATABASE_URL) {
      const seller = await prisma.seller.update({
        where: { id },
        data: { kycStatus: status }
      });

      // Elevate system status and update roles
      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: seller.userId },
          data: { role: 'SELLER' }
        });
      }

      await prisma.notification.create({
        data: {
          userId: seller.userId,
          title: 'Store KYC Audited!',
          message: `Your ShopSphere Seller request was reviewed. Status: ${status}.`,
          type: 'SECURITY',
          read: false
        }
      });

      return res.json({ success: true });
    }

    // --- FALLBACK ---
    dbStore.updateSellerStatus(id, status);
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: 'Database update fault.' });
  }
});

/**
 * @route   POST /api/admin/coupons
 * @desc    Generate a discount coupon code
 */
router.post('/coupons', requireAuth, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { code, discountType, value, minOrderValue, description } = req.body;

  if (!code || !discountType || !value) {
    return res.status(400).json({ error: 'Missing core coupon fields.' });
  }

  try {
    if (process.env.DATABASE_URL) {
      const pCoupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          discountType,
          value: parseFloat(value),
          minOrderValue: parseFloat(minOrderValue) || 0,
          isActive: true,
          description: description || `${code} provides flat saving!`
        }
      });

      const mapped: Coupon = {
        id: pCoupon.id,
        code: pCoupon.code,
        discountType: pCoupon.discountType as any,
        value: pCoupon.value,
        minOrderValue: pCoupon.minOrderValue,
        isActive: pCoupon.isActive,
        description: pCoupon.description
      };

      return res.status(201).json(mapped);
    }

    // --- FALLBACK ---
    const newCoupon: Coupon = {
      id: generateId('coupon'),
      code: code.toUpperCase(),
      discountType,
      value: parseFloat(value),
      minOrderValue: parseFloat(minOrderValue) || 0,
      isActive: true,
      description: description || `${code} delivers discount!`
    };

    dbStore.addCoupon(newCoupon);
    res.status(201).json(newCoupon);

  } catch (err) {
    res.status(500).json({ error: 'Database create coupon fault.' });
  }
});

/**
 * @route   DELETE /api/admin/coupons/:id
 * @desc    Revoke and delete coupons
 */
router.delete('/coupons/:id', requireAuth, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (process.env.DATABASE_URL) {
      await prisma.coupon.delete({
        where: { id }
      });
      return res.json({ success: true });
    }

    // --- FALLBACK ---
    dbStore.deleteCoupon(id);
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: 'Database coupon delete constraints violation.' });
  }
});

export default router;
