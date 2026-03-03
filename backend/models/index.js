const sequelize = require('../db');
const User = require('./User');
const Upload = require('./Upload');
const QaPair = require('./QaPair');

// Define associations
User.hasMany(Upload, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Upload.belongsTo(User, { foreignKey: 'user_id' });

Upload.hasMany(QaPair, { foreignKey: 'upload_id', onDelete: 'CASCADE' });
QaPair.belongsTo(Upload, { foreignKey: 'upload_id' });

module.exports = {
  sequelize,
  User,
  Upload,
  QaPair,
};
