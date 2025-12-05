import { connectDB } from '../config/db.js';
import { seedAdmin } from './seedAdmin.js';
import { seedClasses } from './seedClasses.js';

// This script seeds the database with initial data
async function seed() {
    try {
        // Connect to MongoDB
        await connectDB();

        console.log('🌱 Starting database seeding...\n');

        // Seed admin user
        await seedAdmin();

        // Seed classes
        await seedClasses();

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();
