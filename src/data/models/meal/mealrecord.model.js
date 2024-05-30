import { DataTypes } from "sequelize";
import db from "#lib/sequelize.js";

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
  }
},{
  freezeTableName: true
});


export default MealRecord;