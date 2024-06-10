import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eventService = {
  getAllEventCategories: async () => {
    // Replace with actual database query or data fetching logic
    // return prisma.user.findMany();
    return [
      { id: 1, name: 'Music' },
      { id: 2, name: 'Sports' },
      { id: 3, name: 'Theatre' },
      { id: 4, name: 'Comedy' },
    ];
  },

  // Create a new user
  async createEvent(eventData) {
    return prisma.event
    .create({
      data: eventData,
    })
    .then(newEvent => {
      console.log('done')
      newEvent['status'] = true;
      return newEvent;
    }) //need to do error handling more properly
    .catch(error => {
      console.log('fail ..', error)
      // error instanceof prisma.PrismaClientKnownRequestError
      return {error, status: false};
    });
  },
};

const userService = {
  // Get all users
  async getUsers() {
    return prisma.user.findMany();
  },

  // Get user by ID
  async getUserById(userId) {
    return prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
  },

  // Create a new user
  async createUser(userData) {
    return prisma.user
    .create({
      data: userData,
    })
    .then(newUser => {
      console.log('done')
      newUser['status'] = true;
      return newUser;
    }) //need to do error handling more properly
    .catch(error => {
      console.log('fail')
      // error instanceof prisma.PrismaClientKnownRequestError
      return {error, status: false};
    });
  },

  // Update user by ID
  async updateUser(userId, userData) {
    return prisma.user.update({
      where: {
        user_id: userId,
      },
      data: userData,
    });
  },

  // Delete user by ID
  async deleteUser(userId) {
    return prisma.user.delete({
      where: {
        user_id: userId,
      },
    });
  },
};

export default eventService;
