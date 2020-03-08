'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: { type: Sequelize.STRING(255), allowNull: false },
      full_name: { type: Sequelize.STRING(255), allowNull: false },
      facebook_id: { type: Sequelize.STRING(255), allowNull: true },
      twitter_id: { type: Sequelize.STRING(255), allowNull: true },
      phone_number: { type: Sequelize.BIGINT, allowNull: false },
      address: { type: Sequelize.STRING(255), allowNull: true },
      dob: { type: Sequelize.DATEONLY, allowNull: false },
      gender: { type: Sequelize.STRING(45), allowNull: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      lat: { type: Sequelize.FLOAT(7, 4), allowNull: false, validate: { min: -90, max: 90 }, defaultValue: 0.0 },
      lng: { type: Sequelize.FLOAT(7, 4), allowNull: false, validate: { min: -180, max: 180 }, defaultValue: 0.0 },
      status: { type: Sequelize.ENUM("0", "1"), allowNull: false, defaultValue: "0" },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};