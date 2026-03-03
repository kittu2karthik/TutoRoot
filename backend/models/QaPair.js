const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const QaPair = sequelize.define(
  'QaPair',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'uploads',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'qa_pairs',
    timestamps: false,
  }
);

module.exports = QaPair;
