const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

// const users = [
//   { full_name: 'John Doe', email: 'john@example.com', password: 'password123', contact_number: '1234567890', token: 0, role_id: 1 },
//   { full_name: 'Jane Smith', email: 'jane@example.com', password: 'password456', contact_number: '9876543210', token: 0, role_id: 2 },
// ];

// async function seedUsers() {
//   try {
//     for (const user of users) {
//       await prisma.user.create({ data: user });
//     }
//     console.log('Users seeded successfully.');
//   } catch (error) {
//     console.error('Error seeding users:', error);
//   }
// }

const roles = [
  { role_name: 'customer' },
  { role_name: 'organiser'},
];

async function seedRole() {
  try {
    for (const role of roles) {
      await prisma.Role.create({ data: role });
    }
    console.log('roles seeded successfully.');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}


async function main() {
    await seedRole();
//   await seedUsers();
}

main()
  .catch((error) => {
    console.error('Error during seeding:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


//
// add event categories
//