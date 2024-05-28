import ExerciseRecord from '#data/models/Exercise/exerciserecord.model.js'
import { User, MealRecord } from '#data/relations/relations.js'
import { Sequelize } from 'sequelize'
import { Op } from "sequelize"

async function getObjectOutOfWeekCount(object, start) {
  const result = await object.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(1000), start.setHours(0, 0, 0, 0)]
      }
    }
  })
  return result.length
}

async function getObjectPerDay(object, start, end) {
  return await object.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
      [Sequelize.fn("COUNT", Sequelize.col("uuid")), "count"],
    ],
    where: {
      createdAt: {
        [Op.between]: [end.setHours(0, 0, 0, 0), start.setHours(23, 59, 59, 999)]
      }
    },
    group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
    order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
  })
}

async function generateTimeseries(originalBase, objectList, start_time){
  var iter = 6
  var base = originalBase

  return Array(7).fill(0).map((_) => {
    const date = new Date();
    date.setDate(start_time.getDate() - iter)
    date.setHours(0, 0, 0, 0)

    const object = objectList.find(o => new Date(o.dataValues.date).toDateString() === date.toDateString())

    base = object ? parseInt((object.dataValues.count), 10) + parseInt(base) : parseInt(base)
    iter = iter -1

    return {
      x: date.getTime(),
      y: base
    }
  })
}

export const getData = async (req, res, next) => {
  try {

    if(req.query.type == "numberCard"){
      const users = await User.findAll()
      const meals = await MealRecord.findAll()
      const exercises = await ExerciseRecord.findAll()

      res.send({ 
        "success"    : true, 
        "users"      : users.length,
        "meals"      : meals.length,
        "exercises"  : exercises.length,
      })
    }

    if(req.query.type == "usersChart"){
      let now = new Date()
      let pastWeek = new Date(now)
      pastWeek.setDate(now.getDate() -6)

      var base = await getObjectOutOfWeekCount(User, pastWeek)
      var usersPerDay = await getObjectPerDay(User, now, pastWeek)

      var timeseries = await generateTimeseries(base, usersPerDay, now)
      res.send({ 
        "success"    : true, 
        "timeseries" : timeseries,
      })
    }

    if(req.query.type == "mealsChart"){
      let now = new Date()
      let pastWeek = new Date(now)
      pastWeek.setDate(now.getDate() -6)

      var base = await getObjectOutOfWeekCount(MealRecord, pastWeek)
      var mealsPerDay = await getObjectPerDay(MealRecord, now, pastWeek)

      var timeseries = await generateTimeseries(base, mealsPerDay, now)
      res.send({ 
        "success"    : true, 
        "timeseries" : timeseries,
      })
    }

    if(req.query.type == "exercisesChart"){
      let now = new Date()
      let pastWeek = new Date(now)
      pastWeek.setDate(now.getDate() -6)

      var base = await getObjectOutOfWeekCount(ExerciseRecord, pastWeek)
      var mealsPerDay = await getObjectPerDay(ExerciseRecord, now, pastWeek)

      var timeseries = await generateTimeseries(base, mealsPerDay, now)
      res.send({ 
        "success"    : true, 
        "timeseries" : timeseries,
      })
    }

    if(req.query.type == "usersTable"){
      const users = await User.findAll({
        attributes: ["id", "firstName", "lastName", "phoneNumber"]
      })

      res.send({
        "success": true,
        users
      })
    }

  } catch (error) {
    next(error)
  }
}