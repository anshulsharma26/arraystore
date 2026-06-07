const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    
    await User.deleteMany();
    await Product.deleteMany();

    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@arraystore.com',
      password: 'admin123',
      role: 'admin',
    });

    
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
    });

    console.log('✅ Users seeded');

    
    const products = [
      {
        name: 'Classic Oxford Leather Shoes',
        description: 'Premium full-grain leather Oxford shoes with Goodyear welt construction. Perfect for formal occasions and business meetings.',
        brand: 'Heritage Craft',
        category: 'Shoes',
        basePrice: 4999,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'OXF-BLK-8', size: '8', color: 'Black', price: 4999, stock: 15 },
          { sku: 'OXF-BLK-9', size: '9', color: 'Black', price: 4999, stock: 20 },
          { sku: 'OXF-BLK-10', size: '10', color: 'Black', price: 4999, stock: 12 },
          { sku: 'OXF-BRN-8', size: '8', color: 'Brown', price: 5299, stock: 10 },
          { sku: 'OXF-BRN-9', size: '9', color: 'Brown', price: 5299, stock: 8 },
          { sku: 'OXF-BRN-10', size: '10', color: 'Brown', price: 5299, stock: 0 },
          { sku: 'OXF-TAN-9', size: '9', color: 'Tan', price: 5499, stock: 5 },
          { sku: 'OXF-TAN-10', size: '10', color: 'Tan', price: 5499, stock: 7 },
        ],
        averageRating: 4.5,
        numReviews: 128,
      },
      {
        name: 'Ultraboost Running Sneakers',
        description: 'Responsive Boost midsole cushioning with Primeknit upper for adaptive support. Designed for road running and everyday comfort.',
        brand: 'Velocity Sport',
        category: 'Shoes',
        basePrice: 7999,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'UB-WHT-8', size: '8', color: 'White', price: 7999, stock: 25 },
          { sku: 'UB-WHT-9', size: '9', color: 'White', price: 7999, stock: 30 },
          { sku: 'UB-WHT-10', size: '10', color: 'White', price: 7999, stock: 18 },
          { sku: 'UB-BLK-8', size: '8', color: 'Black', price: 7999, stock: 22 },
          { sku: 'UB-BLK-9', size: '9', color: 'Black', price: 7999, stock: 28 },
          { sku: 'UB-RED-9', size: '9', color: 'Red', price: 8499, stock: 10 },
          { sku: 'UB-RED-10', size: '10', color: 'Red', price: 8499, stock: 0 },
        ],
        averageRating: 4.8,
        numReviews: 256,
      },
      {
        name: 'Slim Fit Denim Jacket',
        description: 'Washed denim jacket with a modern slim fit. Features button-front closure, chest pockets, and adjustable button cuffs.',
        brand: 'Urban Edge',
        category: 'Jackets',
        basePrice: 3499,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'DJ-BLU-S', size: 'S', color: 'Blue', price: 3499, stock: 20 },
          { sku: 'DJ-BLU-M', size: 'M', color: 'Blue', price: 3499, stock: 30 },
          { sku: 'DJ-BLU-L', size: 'L', color: 'Blue', price: 3499, stock: 25 },
          { sku: 'DJ-BLU-XL', size: 'XL', color: 'Blue', price: 3599, stock: 15 },
          { sku: 'DJ-BLK-S', size: 'S', color: 'Black', price: 3699, stock: 12 },
          { sku: 'DJ-BLK-M', size: 'M', color: 'Black', price: 3699, stock: 18 },
          { sku: 'DJ-BLK-L', size: 'L', color: 'Black', price: 3699, stock: 0 },
        ],
        averageRating: 4.3,
        numReviews: 89,
      },
      {
        name: 'Premium Cotton Crew T-Shirt',
        description: 'Ultra-soft 100% organic cotton crew neck tee. Pre-shrunk fabric with reinforced collar for lasting comfort.',
        brand: 'Essentials Co.',
        category: 'T-Shirts',
        basePrice: 899,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'CT-WHT-S', size: 'S', color: 'White', price: 899, stock: 50 },
          { sku: 'CT-WHT-M', size: 'M', color: 'White', price: 899, stock: 60 },
          { sku: 'CT-WHT-L', size: 'L', color: 'White', price: 899, stock: 40 },
          { sku: 'CT-BLK-S', size: 'S', color: 'Black', price: 899, stock: 45 },
          { sku: 'CT-BLK-M', size: 'M', color: 'Black', price: 899, stock: 55 },
          { sku: 'CT-BLK-L', size: 'L', color: 'Black', price: 899, stock: 35 },
          { sku: 'CT-NVY-M', size: 'M', color: 'Navy', price: 999, stock: 30 },
          { sku: 'CT-NVY-L', size: 'L', color: 'Navy', price: 999, stock: 25 },
          { sku: 'CT-GRY-M', size: 'M', color: 'Grey', price: 949, stock: 20 },
        ],
        averageRating: 4.6,
        numReviews: 412,
      },
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res audio certification.',
        brand: 'SoundPulse',
        category: 'Electronics',
        basePrice: 12999,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'HP-BLK', size: 'One Size', color: 'Black', price: 12999, stock: 30 },
          { sku: 'HP-WHT', size: 'One Size', color: 'White', price: 12999, stock: 25 },
          { sku: 'HP-BLU', size: 'One Size', color: 'Midnight Blue', price: 13499, stock: 15 },
          { sku: 'HP-SLV', size: 'One Size', color: 'Silver', price: 13999, stock: 10 },
        ],
        averageRating: 4.7,
        numReviews: 320,
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with Cherry MX switches, N-key rollover, and aircraft-grade aluminum frame.',
        brand: 'TechForge',
        category: 'Electronics',
        basePrice: 6499,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'KB-BLK-RED', size: 'Full', color: 'Black (Red Switch)', price: 6499, stock: 20 },
          { sku: 'KB-BLK-BRN', size: 'Full', color: 'Black (Brown Switch)', price: 6499, stock: 18 },
          { sku: 'KB-WHT-RED', size: 'Full', color: 'White (Red Switch)', price: 6799, stock: 12 },
          { sku: 'KB-BLK-TKL', size: 'TKL', color: 'Black (Red Switch)', price: 5999, stock: 15 },
        ],
        averageRating: 4.4,
        numReviews: 178,
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Handcrafted genuine leather crossbody bag with adjustable strap, zip compartments, and antique brass hardware.',
        brand: 'Artisan Guild',
        category: 'Bags',
        basePrice: 2799,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'CB-BRN', size: 'One Size', color: 'Brown', price: 2799, stock: 20 },
          { sku: 'CB-BLK', size: 'One Size', color: 'Black', price: 2799, stock: 25 },
          { sku: 'CB-TAN', size: 'One Size', color: 'Tan', price: 2999, stock: 15 },
          { sku: 'CB-OLV', size: 'One Size', color: 'Olive', price: 2899, stock: 0 },
        ],
        averageRating: 4.2,
        numReviews: 67,
      },
      {
        name: 'Smart Fitness Watch Pro',
        description: 'Advanced fitness tracker with AMOLED display, heart rate monitor, GPS, blood oxygen sensor, and 14-day battery life.',
        brand: 'VitalTech',
        category: 'Electronics',
        basePrice: 9999,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'FW-BLK-42', size: '42mm', color: 'Black', price: 9999, stock: 35 },
          { sku: 'FW-BLK-46', size: '46mm', color: 'Black', price: 10499, stock: 30 },
          { sku: 'FW-SLV-42', size: '42mm', color: 'Silver', price: 10499, stock: 20 },
          { sku: 'FW-SLV-46', size: '46mm', color: 'Silver', price: 10999, stock: 15 },
          { sku: 'FW-GLD-42', size: '42mm', color: 'Rose Gold', price: 11499, stock: 10 },
        ],
        averageRating: 4.6,
        numReviews: 543,
      },
      {
        name: 'Tapered Chino Trousers',
        description: 'Modern tapered fit chinos in stretch cotton twill. Features slant pockets and a clean flat-front design.',
        brand: 'Urban Edge',
        category: 'Trousers',
        basePrice: 1999,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'CH-KHK-30', size: '30', color: 'Khaki', price: 1999, stock: 25 },
          { sku: 'CH-KHK-32', size: '32', color: 'Khaki', price: 1999, stock: 30 },
          { sku: 'CH-KHK-34', size: '34', color: 'Khaki', price: 1999, stock: 20 },
          { sku: 'CH-NVY-30', size: '30', color: 'Navy', price: 2199, stock: 18 },
          { sku: 'CH-NVY-32', size: '32', color: 'Navy', price: 2199, stock: 22 },
          { sku: 'CH-OLV-32', size: '32', color: 'Olive', price: 2199, stock: 15 },
          { sku: 'CH-BLK-32', size: '32', color: 'Black', price: 2099, stock: 0 },
        ],
        averageRating: 4.1,
        numReviews: 156,
      },
      {
        name: 'Polarized Aviator Sunglasses',
        description: 'Classic aviator sunglasses with polarized lenses, UV400 protection, and lightweight titanium frame.',
        brand: 'OptiLux',
        category: 'Accessories',
        basePrice: 1499,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'SG-GLD-GRN', size: 'One Size', color: 'Gold/Green', price: 1499, stock: 30 },
          { sku: 'SG-SLV-BLU', size: 'One Size', color: 'Silver/Blue', price: 1499, stock: 25 },
          { sku: 'SG-BLK-GRY', size: 'One Size', color: 'Black/Grey', price: 1599, stock: 20 },
          { sku: 'SG-GLD-BRN', size: 'One Size', color: 'Gold/Brown', price: 1599, stock: 15 },
        ],
        averageRating: 4.3,
        numReviews: 198,
      },
      {
        name: 'Quilted Winter Puffer Jacket',
        description: 'Insulated puffer jacket with water-resistant shell, synthetic down fill, and detachable hood for ultimate winter protection.',
        brand: 'Alpine Core',
        category: 'Jackets',
        basePrice: 5999,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'PJ-BLK-S', size: 'S', color: 'Black', price: 5999, stock: 15 },
          { sku: 'PJ-BLK-M', size: 'M', color: 'Black', price: 5999, stock: 20 },
          { sku: 'PJ-BLK-L', size: 'L', color: 'Black', price: 5999, stock: 12 },
          { sku: 'PJ-NVY-M', size: 'M', color: 'Navy', price: 6299, stock: 10 },
          { sku: 'PJ-NVY-L', size: 'L', color: 'Navy', price: 6299, stock: 8 },
          { sku: 'PJ-OLV-M', size: 'M', color: 'Olive', price: 6299, stock: 0 },
        ],
        averageRating: 4.5,
        numReviews: 94,
      },
      {
        name: 'Minimalist Canvas Backpack',
        description: 'Durable canvas backpack with laptop compartment, water bottle pockets, and YKK zippers. Capacity: 25L.',
        brand: 'Artisan Guild',
        category: 'Bags',
        basePrice: 1899,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        variants: [
          { sku: 'BP-GRY', size: 'One Size', color: 'Grey', price: 1899, stock: 30 },
          { sku: 'BP-BLK', size: 'One Size', color: 'Black', price: 1899, stock: 35 },
          { sku: 'BP-NVY', size: 'One Size', color: 'Navy', price: 1999, stock: 20 },
          { sku: 'BP-GRN', size: 'One Size', color: 'Forest Green', price: 1999, stock: 18 },
        ],
        averageRating: 4.4,
        numReviews: 231,
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    console.log('\n========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('========================================');
    console.log('Admin: admin@arraystore.com / admin123');
    console.log('Customer: john@example.com / password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
