'use strict';
module.exports = (sequelize, DataTypes) => {
  const Walker = sequelize.define('Walker', {
    name: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {});
  Walker.associate = function(models) {
    // associations can be defined here
  };
  return Walker;
};