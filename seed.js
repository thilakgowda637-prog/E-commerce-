require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  const demoUser = await User.create({
    name: 'Demo User',
    email: 'user@example.com',
    password: 'user1234',
    role: 'user',
  });

  const products = await Product.insertMany([
    { name: 'Wireless Headphones', description: 'Over-ear wireless headphones with noise cancellation and 30hr battery life.', price: 79.99, category: 'Electronics', imageUrl: 'https://loremflickr.com/400/300/headphones', stock: 25, createdBy: admin._id },
    { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with hot-swappable switches.', price: 59.99, category: 'Electronics', imageUrl: 'https://loremflickr.com/400/300/keyboard,mechanical', stock: 40, createdBy: admin._id },
    { name: 'Running Shoes', description: 'Lightweight breathable running shoes for daily training.', price: 49.5, category: 'Footwear', imageUrl: 'https://loremflickr.com/400/300/running,shoes', stock: 60, createdBy: admin._id },
    { name: 'Ceramic Coffee Mug', description: 'Hand-glazed 12oz ceramic mug, microwave and dishwasher safe.', price: 12.0, category: 'Home', imageUrl: 'https://loremflickr.com/400/300/coffee,mug', stock: 100, createdBy: admin._id },
    { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat, 6mm thick.', price: 24.99, category: 'Fitness', imageUrl: 'https://loremflickr.com/400/300/yoga,mat', stock: 35, createdBy: admin._id },
    { name: 'Backpack', description: 'Water-resistant 25L backpack with laptop sleeve.', price: 39.99, category: 'Accessories', imageUrl: 'https://loremflickr.com/400/300/backpack', stock: 20, createdBy: admin._id },
  ]);

  console.log('Seed complete:');
  console.log(`  Admin login -> email: admin@example.com | password: admin123`);
  console.log(`  User login  -> email: user@example.com  | password: user1234`);
  console.log(`  Products inserted: ${products.length}`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});