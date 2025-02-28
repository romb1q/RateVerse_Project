'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      ReviewID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ReviewUserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ReviewContentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contents',
          key: 'ContentID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ReviewText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ReviewDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      ReviewStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'available',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Reviews');
  },
};
