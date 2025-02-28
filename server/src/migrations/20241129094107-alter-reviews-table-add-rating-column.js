'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reviews', 'ReviewRating', {
      type: Sequelize.INTEGER,
      allowNull: true, // Рейтинг может быть пустым
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reviews', 'ReviewRating');
  },
};
