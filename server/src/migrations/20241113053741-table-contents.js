'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contents', {
      ContentID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ContentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ContentName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ContentImage: {
        type: Sequelize.BLOB,  // Изменено на BLOB для хранения бинарных данных
        allowNull: true,
      },
      ContentCrew: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ContentDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ContentDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ContentGenre: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Contents');
  },
};
