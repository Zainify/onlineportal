import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

export async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lms.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'System Administrator',
      email: 'admin@lms.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully (admin@lms.com / admin123)');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}
