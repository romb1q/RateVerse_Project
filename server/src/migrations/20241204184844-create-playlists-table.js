// src/migrations/XXXXXXXXXXXXXX-create-playlists.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Playlists', {
      PlaylistID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      PlaylistUserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Таблица Users
          key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      PlaylistName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PlaylistDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      PlaylistDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Playlists');
  },
};
