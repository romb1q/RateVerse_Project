'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        UserName: 'root',
        UserPassword: '123',
        UserRole: 'admin',
        UserStatus: 'active',
      },
      {
        UserName: 'romb1q',
        UserPassword: '321',
        UserRole: 'user',
        UserStatus: 'active',
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
