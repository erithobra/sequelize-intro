'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pets', null, {})
      .then(() => {
        return queryInterface.bulkInsert('Pets', [
          {
            name: 'Diesel',
            breed: 'Terrier',
            age: 2,
            ownerId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }, {
            name: 'Timmy',
            breed: 'cat',
            age: 2,
            ownerId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }, {
            name: 'Crowley',
            breed: 'black',
            age: 2,
            ownerId: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], {});
      })

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
