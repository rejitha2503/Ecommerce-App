import { Router, Request, Response } from 'express';
import { dbStore } from '../db';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../auth';
import { validateReview } from '../validation';
import { Review } from '../../types';

const router = Router();

// ID generator
const generateId = (prefix: string = 'rev') => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * @route   POST /api/products/:productId/review
 * @desc    Submit verified review comments and aggregate aggregate product rating indexes.
 */
router.post('/:productId/review', requireAuth, validateReview, async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const user = req.user!;

  try {
    const starScore = parseInt(rating);

    if (process.env.DATABASE_URL) {
      // 1. Verify product listing exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { reviews: true }
      });

      if (!product) {
        return res.status(404).json({ error: 'Subject product listing not found.' });
      }

      // 2. Clear out any previous system review submitted by this user to enforce unique reviews
      await prisma.review.deleteMany({
        where: { productId, userId: user.id }
      });

      // 3. Create review entity
      const newReview = await prisma.review.create({
        data: {
          productId,
          userId: user.id,
          userName: user.email.split('@')[0], // Extract standard human username
          rating: starScore,
          comment
        }
      });

      // 4. Retrieve complete reviews pool to calculate aggregate average rating
      const allReviews = await prisma.review.findMany({
        where: { productId }
      });

      const totalCount = allReviews.length;
      const ratingSum = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const computedRating = parseFloat((ratingSum / totalCount).toFixed(1)) || 5.0;

      // 5. Commit aggregated score back into catalog
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: computedRating,
          reviewsCount: totalCount
        }
      });

      const mappedReview: Review = {
        id: newReview.id,
        productId: newReview.productId,
        userId: newReview.userId,
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: newReview.createdAt.toISOString()
      };

      return res.status(201).json(mappedReview);
    }

    // --- FALLBACK ---
    const product = dbStore.getProducts().find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Subject product listing not found.' });
    }

    const newReviewFallback: Review = {
      id: generateId('rev'),
      productId,
      userId: user.id,
      userName: user.email.split('@')[0],
      rating: starScore,
      comment,
      createdAt: new Date().toISOString()
    };

    dbStore.addReview(newReviewFallback);
    res.status(201).json(newReviewFallback);

  } catch (err: any) {
    console.error('Submit review error:', err);
    res.status(500).json({ error: 'Failed to write critique review indices in catalog schema.' });
  }
});

export default router;
