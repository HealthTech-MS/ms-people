import { DataTypes } from "sequelize";
import db from "#lib/sequelize.js";
import moment from "moment"

const MealRecord = db.define('meal_records',{ 
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uuid:{
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate:{ 
      notEmpty: true
    }
  }, 
  name:{
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notEmpty: true,
      len: [3, 25]
    }
  },
  type:{
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notEmpty: true,
    }
  },
  score:{
    type: DataTypes.FLOAT,
    allowNull: false,
    validate:{
      notEmpty: true,
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
},{
  freezeTableName: true
});


export default MealRecord;