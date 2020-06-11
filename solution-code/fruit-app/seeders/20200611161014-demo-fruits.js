'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {//up method will run when we run seeder file
    return queryInterface.bulkInsert('Fruits', [
      {
        name:'apple',
        color: 'red',
        readyToEat: true
      },
      {
        name:'pear',
        color: 'green',
        readyToEat: false
      },
      {
        name:'banana',
        color: 'yellow',
        readyToEat: true
      }
    ])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {//undo
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
