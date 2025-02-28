'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      LikeID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      LikeUserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Имя таблицы пользователей
          key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      LikeContentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contents', // Имя таблицы контента
          key: 'ContentID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      LikeDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Likes');
  },
};
