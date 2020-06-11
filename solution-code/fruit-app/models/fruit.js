'use strict';
module.exports = (sequelize, DataTypes) => {
  const Fruit = sequelize.define('Fruit', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    readyToEat: DataTypes.BOOLEAN
  }, {});
  Fruit.associate = function(models) {
    // associations can be defined here
  };
  return Fruit;
};