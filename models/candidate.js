'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('candidate', {
    	first_name:   { type: DataTypes.STRING(255), allowNull: true },
		last_name:    { type: DataTypes.STRING(255), allowNull: true },
		company_name: { type: DataTypes.STRING(255), allowNull: true },
		address:      { type: DataTypes.STRING(255), allowNull: true },
		city: 		  { type: DataTypes.STRING(255), allowNull: true },
		state:        { type: DataTypes.STRING(255), allowNull: true},
		postal_code:  { type: DataTypes.STRING(255), allowNull: true},
		country:      { type: DataTypes.STRING(255), allowNull: true },
		email:        { type: DataTypes.STRING(255), allowNull: false },
		phone:        { type: DataTypes.BIGINT, allowNull: false },
		details:      { type: DataTypes.STRING(255), allowNull: true },
		cv_path:      { type: DataTypes.STRING(255), allowNull: false },
		createdAt:    { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW },
		updatedAt:    { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW }
  }, {
	
});
  
Candidate.associate = function(models) {
   
  };

  return Candidate;
};