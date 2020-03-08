'use strict';

module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('vehicle_specs', {
    chasis_no:            { type: DataTypes.STRING(255), allowNull: false, unique: true },    
    name:                 { type: DataTypes.STRING(255), allowNull: true },
    model:                { type: DataTypes.STRING(255), allowNull: true },
    colour:               { type: DataTypes.STRING(255), allowNull: false },
    engine_displacement:  { type: DataTypes.STRING(255), allowNull: true },
    average:              { type: DataTypes.STRING(255), allowNull: true },
    engine_type:          { type: DataTypes.STRING(255), allowNull: true },
    createdAt:            { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW },
    updatedAt:            { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW } 
  });

  Vehicle.associate = function(models) {
    // models.User.hasMany(models.Task);
  };

  return Vehicle;
};