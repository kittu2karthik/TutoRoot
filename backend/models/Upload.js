const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Upload = sequelize.define(
  'Upload',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if relation is not strictly constrained, but it references User
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    question_pdf_filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    answer_pdf_filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'uploads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Upload;
