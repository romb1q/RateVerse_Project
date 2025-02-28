// src/migrations/XXXXXXXXXXXXXX-create-playlist-contents.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PlaylistContents', {
      PlaylistID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Playlists', // Таблица Playlists
          key: 'PlaylistID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true, // Составной ключ
      },
      ContentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contents', // Таблица Contents
          key: 'ContentID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true, // Составной ключ
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PlaylistContents');
  },
};
