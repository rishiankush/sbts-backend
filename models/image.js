'use strict';
module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define('image', {
    user_id:     { type: DataTypes.INTEGER(50), allowNull: false },
    path:        { type: DataTypes.TEXT(), allowNull: true },
    status:      { type: DataTypes.ENUM(0, 1), allowNull: false, defaultValue: 1 },
    createdAt:   { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW },
    updatedAt:   { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW }
  },
    {});
  image.associate = function (models) {
    // associations can be defined here
  };
  return image;
};