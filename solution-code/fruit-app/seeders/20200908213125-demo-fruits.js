'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Fruits', [
      {
          name:'apple',
          color: 'red',
          readyToEat: true,
      },
      {
          name:'pear',
          color: 'green',
          readyToEat: false,
      },
      {
          name:'banana',
          color: 'yellow',
          readyToEat: true,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
