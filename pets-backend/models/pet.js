'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define('Pet', {
    name: DataTypes.STRING,
    breed: DataTypes.STRING
  }, {});
  Pet.associate = function(models) {
    // associations can be defined here
  };
  return Pet;
};