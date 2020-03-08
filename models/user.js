'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    	email:        { type: DataTypes.STRING(255), allowNull: false },
		full_name:    { type: DataTypes.STRING(255), allowNull: true },
		facebook_id:  { type: DataTypes.STRING(255), allowNull: true },
		twitter_id:   { type: DataTypes.STRING(255), allowNull: true },
		phone_number: { type: DataTypes.BIGINT, allowNull: true },
		address:      { type: DataTypes.STRING(255), allowNull: true },
		dob: 		  { type: DataTypes.DATEONLY, allowNull: true },
		gender:       { type: DataTypes.STRING(45), allowNull: true},
		password:     { type: DataTypes.STRING(255), allowNull: true},
		lat:          { type: DataTypes.FLOAT(7,4), allowNull: true, validate: { min: -90, max: 90 }, defaultValue: 0.0 },
		lng:          { type: DataTypes.FLOAT(7,4), allowNull: true, validate: { min: -180, max: 180 }, defaultValue: 0.0 },
		status:       { type: DataTypes.ENUM(0,1), allowNull: true, defaultValue: 1 },
		createdAt:    { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW },
		updatedAt:    { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW }
  }, {
	instanceMethods: {
		verifyPassword: function(password, done) {
			return bcrypt.compare(password, this.password, function(err, res) {
			  return done(err, res);
			});
		  }
	}
});
  
  User.associate = function(models) {
   // User.hasOne('image', { as: 'ProfilePicture', constraints: false })

  };

  return User;
};