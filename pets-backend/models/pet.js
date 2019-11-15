'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define('Pet', {
    name: DataTypes.STRING,
    breed: DataTypes.STRING,
    age: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER
  }, {});
  Pet.associate = function (models) {
    Pet.belongsTo(models.Owner, { foreignKey: 'ownerId' })
  };
  return Pet;
};