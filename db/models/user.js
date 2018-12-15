'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isUnique: async (email, next) => {
          const userExists = await user.findOne({ where: {email: email} })
          if(userExists){
            return next("User already exists.")
          }
          next()
        }
      }
    },
    password: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
