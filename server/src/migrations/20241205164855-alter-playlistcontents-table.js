'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем внешний ключ PlaylistID в таблицу PlaylistContents
    // await queryInterface.addColumn('PlaylistContents', 'PlaylistID', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Playlists', // Имя таблицы Playlists
    //     key: 'PlaylistID', // Первичный ключ из таблицы Playlists
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE',
    // });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем внешний ключ PlaylistID из таблицы PlaylistContents
    //await queryInterface.removeColumn('PlaylistContents', 'PlaylistID');
  },
};
