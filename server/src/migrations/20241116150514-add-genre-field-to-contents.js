'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contents', 'ContentGenre', {
      type: Sequelize.STRING,
      allowNull: true, // Поле необязательное
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Contents', 'ContentGenre');
  },
};
