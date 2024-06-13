import Sequelize from 'sequelize';

import sequelize from '../util/database';

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING, // If you just want to set the type you can just set it like this
  email: Sequelize.STRING,
});

export default User;
