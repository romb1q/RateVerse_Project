'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Views', {
      ViewID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ViewUserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Имя таблицы пользователей
          key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ViewContentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contents', // Имя таблицы контента
          key: 'ContentID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ViewDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Views');
  },
};
