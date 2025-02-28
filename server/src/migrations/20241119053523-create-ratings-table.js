'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ratings', {
      RatingID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      RatingUserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RatingContentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contents',
          key: 'ContentID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RatingScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      RatingDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Ratings');
  },
};
