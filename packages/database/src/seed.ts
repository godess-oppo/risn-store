import { db } from './index';
import { users, products, productImages } from './schema';

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Create demo users
    const demoUsers = await db.insert(users).values([
      {
        email: 'demo@fashionpod.com',
        name: 'Demo User',
        role: 'customer',
      },
      {
        email: 'admin@fashionpod.com', 
        name: 'Admin User',
        role: 'admin',
      },
    ]).returning();

    // Create demo products
    const demoProducts = await db.insert(products).values([
      {
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with perfect fit',
        price: '29.99',
        categories: ['tops', 'basics'],
        tags: ['casual', 'essential', 'cotton'],
        quantity: 100,
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Comfortable slim fit jeans with stretch',
        price: '89.99',
        categories: ['bottoms', 'denim'],
        tags: ['denim', 'slim-fit', 'casual'],
        quantity: 50,
      },
      {
        name: 'Leather Jacket',
        description: 'Genuine leather jacket with modern cut',
        price: '299.99',
        categories: ['outerwear', 'jackets'],
        tags: ['leather', 'premium', 'statement'],
        quantity: 25,
      },
    ]).returning();

    // Create product images
    await db.insert(productImages).values([
      {
        productId: demoProducts[0].id,
        url: '/images/tshirt-white.jpg',
        alt: 'Classic White T-Shirt',
        order: 0,
      },
      {
        productId: demoProducts[1].id, 
        url: '/images/jeans-slim.jpg',
        alt: 'Slim Fit Jeans',
        order: 0,
      },
      {
        productId: demoProducts[2].id,
        url: '/images/jacket-leather.jpg',
        alt: 'Leather Jacket',
        order: 0,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`   Users: ${demoUsers.length}`);
    console.log(`   Products: ${demoProducts.length}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main().catch(console.error);
