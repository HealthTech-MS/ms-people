import createError from 'http-errors'
import { User, MealRecord } from '#data/relations/relations.js'
import { mealRecordSchema, getRecordSchema } from '#validators/meal/mealRecordValidation.js'

export const getRecords = async (req, res, next) => {
  try{
    const validationResult = await getRecordSchema.validateAsync(req.query)

    const user = await User.findOne({
      where: {
        uuid: validationResult.uuid
      }
    })

    if(!user){
      throw createError.NotFound('User not found')
    }

    let start;
    let end;

    if(validationResult.range == "today"){
      start = new Date().setHours(0, 0, 0, 0);
      end = new Date(start);

      end.setDate(new Date(start).getDate() + 1);
      end.setSeconds(end.getSeconds() - 1);
    } else {
      start = new Date(validationResult.range)
      end = new Date(start)

      end.setDate(new Date(start).getDate() + 1);
      end.setSeconds(end.getSeconds() - 1);
    }

    const oRecords = await MealRecord.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ["id", "uuid", "name", "type", "createdAt", "updatedAt"]
    })

    var records = []
    
    for(var i = 0; i < oRecords.length; i++){
      const date = new Date(oRecords[i].createdAt.replace(" ","T"))
      if(date >= start && date <= end){
        records.push(oRecords[i])
      }
    }

    if(records.length == 0){
      throw createError.NotFound("No meals found")
    }
    
    res.send({ "success": true, records })
  } catch (error) {
    if(error.isJoi === true){
      error.status = 406
    }
    next(error)
  }
  
}

export const getRecordDays = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.query.uuid
    }
  });
  if(!user){
      return res.status(404).json({msg: "Usuario no encontrado"})
  };

  const records = await MealRecord.findAll({
    where: {
      user_id: user.id
    }
  })

  const repeatedDates = records.map(record => record.createdAt.split(" ")[0] + "T06:00:01.000Z")
  const dates = [...new Set(repeatedDates)]
  res.send({ "success": true, dates })
}

export const addRecord = async (req, res, next) => {
  try {
    const result = await mealRecordSchema.validateAsync(req.body)

    const user = await User.findOne({
      where: {
        uuid: result.uuid
      }
    });
    if(!user){
        return res.status(404).json({msg: "Usuario no encontrado"})
    };
    
    await MealRecord.create({
      name: result.name,
      type: result.type,
      score: result.score,
      user_id: user.id
    })

    res.send({ "success": true })
  } catch (error) {
    if(error.isJoi === true){
      error.status = 406
    }
    next(error)
  }
}


