'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Owners', [
      {
        firstName: 'Marc',
        lastName: 'Wright',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Schmitty',
        lastName: 'McGoo',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
