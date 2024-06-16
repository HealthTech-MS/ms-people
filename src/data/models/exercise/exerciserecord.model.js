import { DataTypes } from "sequelize";
import db from "#lib/sequelize.js";
import moment from "moment"

const ExerciseRecord = db.define('exercise_records', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 25]
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: function () {
      return moment.tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    },
    get: function () {
      const rawValue = this.getDataValue('createdAt');
      return moment.tz(rawValue, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: function () {
      return moment.tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    },
    get: function () {
      const rawValue = this.getDataValue('updatedAt');
      return moment.tz(rawValue, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    },
  },
}, {
  freezeTableName: true
});

export default ExerciseRecord;
