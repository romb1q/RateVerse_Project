'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Ratings', {
      fields: ['RatingUserID', 'RatingContentID'],
      type: 'unique',
      name: 'unique_user_content_rating',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('Ratings', 'unique_user_content_rating');
  },
};
