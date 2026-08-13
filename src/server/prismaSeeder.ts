import { prisma } from './prisma';
import { generateShopSphereSeed } from './seedGenerator';
import { hashPassword } from './auth';

export async function seedPrismaIfNecessary() {
  if (!process.env.DATABASE_URL) {
    console.log('[ShopSphere Prisma Seeder] DATABASE_URL is not set. Skipping Prisma DB seeding.');
    return;
  }

  try {
    const productCount = await prisma.product.count();
    if (productCount >= 500) {
      console.log(`[ShopSphere Prisma Seeder] Database already populated with ${productCount} products. Skipping.`);
      return;
    }

    console.log('[ShopSphere Prisma Seeder] Database empty or low on items. Commencing production-grade seeding of 1000+ nodes...');
    
    // Clear existing data safely
    console.log('[ShopSphere Prisma Seeder] Cleaning historic collections...');
    await prisma.review.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.product.deleteMany();
    await prisma.seller.deleteMany();
    await prisma.user.deleteMany();

    const seed = generateShopSphereSeed();

    // 1. Insert Users with dynamic password hashes
    console.log('[ShopSphere Prisma Seeder] Registering primary secure accounts...');
    for (const u of seed.users) {
      const rawPassword = seed.passwords[u.id] || 'customer123';
      const pHash = await hashPassword(rawPassword);
      
      await prisma.user.create({
        data: {
          id: u.id,
          email: u.email,
          name: u.name,
          passwordHash: pHash,
          role: u.role,
          rewardPoints: u.rewardPoints,
          referralCode: u.referralCode,
          verified: u.verified,
          createdAt: new Date(u.createdAt)
        }
      });
    }

    // 2. Insert Sellers
    console.log('[ShopSphere Prisma Seeder] Allocating merchant profiles...');
    for (const s of seed.sellers) {
      await prisma.seller.create({
        data: {
          id: s.id,
          userId: s.userId,
          storeName: s.storeName,
          description: s.description,
          kycStatus: s.kycStatus,
          joinedAt: new Date(s.joinedAt)
        }
      });
    }

    // 3. Insert Coupons
    console.log('[ShopSphere Prisma Seeder] Printing savings coupons...');
    for (const c of seed.coupons) {
      await prisma.coupon.create({
        data: {
          id: c.id,
          code: c.code,
          discountType: c.discountType,
          value: c.value,
          minOrderValue: c.minOrderValue,
          isActive: c.isActive,
          description: c.description
        }
      });
    }

    // 4. Insert Products
    console.log('[ShopSphere Prisma Seeder] Ingesting catalog nodes (1000+ items)...');
    
    // To handle 1000 items efficiently, we do batching
    const batchSize = 100;
    const productsList = seed.products;
    
    for (let i = 0; i < productsList.length; i += batchSize) {
      const batch = productsList.slice(i, i + batchSize);
      await prisma.product.createMany({
        data: batch.map(p => ({
          id: p.id,
          sku: p.sku || null,
          title: p.title,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          category: p.category,
          subCategory: p.subCategory || null,
          brand: p.brand,
          images: p.images,
          variantsJson: p.variants ? JSON.stringify(p.variants) : null,
          stock: p.stock,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          sellerId: p.sellerId,
          sellerName: p.sellerName,
          isTrending: p.isTrending || false,
          isFlashSale: p.isFlashSale || false,
          createdAt: new Date(p.createdAt)
        }))
      });
    }

    // 5. Insert Reviews
    console.log('[ShopSphere Prisma Seeder] Collecting customer reviews & feedback...');
    const reviewsList = seed.reviews;
    for (let i = 0; i < reviewsList.length; i += batchSize) {
      const batch = reviewsList.slice(i, i + batchSize);
      await prisma.review.createMany({
        data: batch.map(r => ({
          id: r.id,
          productId: r.productId,
          userId: r.userId,
          userName: r.userName,
          rating: r.rating,
          comment: r.comment,
          createdAt: new Date(r.createdAt)
        }))
      });
    }

    // Insert Default Customer Address to make checkouts seamless
    console.log('[ShopSphere Prisma Seeder] Formatting shipping endpoints...');
    await prisma.address.create({
      data: {
        id: 'addr-1',
        userId: 'user-cust-1',
        fullName: 'Rejitha Customer',
        phone: '+919876543210',
        street: '102, Shanti Vihar Complex, JP Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400053',
        isDefault: true
      }
    });

    console.log(`[ShopSphere Prisma Seeder] SUCCESS: Ingested ${await prisma.product.count()} products, ${await prisma.user.count()} users, ${await prisma.seller.count()} sellers, ${await prisma.coupon.count()} coupons, ${await prisma.review.count()} reviews.`);
  } catch (err) {
    console.error('[ShopSphere Prisma Seeder] CRITICAL SEEDING FAILURE:', err);
  }
}
