'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: { type: DataTypes.INTEGER(50), allowNull: false },
      path: { type: DataTypes.TEXT(), allowNull: true },
      lat: { type: DataTypes.FLOAT(7, 4), allowNull: false, validate: { min: -90, max: 90 }, defaultValue: 0.0 },
      lng: { type: DataTypes.FLOAT(7, 4), allowNull: false, validate: { min: -180, max: 180 }, defaultValue: 0.0 },
      status: { type: DataTypes.ENUM("0", "1"), allowNull: false, defaultValue: "0" },
      createdAt: { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW },
      updatedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('images');
  }
};