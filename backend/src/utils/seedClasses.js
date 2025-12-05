import { Class } from '../models/index.js';

export async function seedClasses() {
  try {
    // Check if classes already exist
    const existingClasses = await Class.find();
    if (existingClasses.length > 0) {
      console.log('Classes already exist');
      return;
    }

    // Create sample classes
    const classes = [
      { title: 'Class 1' },
      { title: 'Class 2' },
      { title: 'Class 3' },
      { title: 'Class 4' },
      { title: 'Class 5' },
      { title: 'Class 6' },
      { title: 'Class 7' },
      { title: 'Class 8' },
      { title: 'Class 9' },
      { title: 'Class 10' },
      { title: 'Class 11' },
      { title: 'Class 12' }
    ];

    await Class.insertMany(classes);
    console.log('classes created successfully');
  } catch (error) {
    console.error('Error seeding classes:', error);
  }
}
