'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      UserID: {
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      UserName: {
        type: Sequelize.DataTypes.STRING, 
        allowNull: false,
      },
      UserPassword: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      UserRole: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      UserStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
