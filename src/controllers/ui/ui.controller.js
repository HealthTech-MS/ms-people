import ExerciseRecord from '#data/models/exercise/exerciserecord.model.js'
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

async function getAttributesPerTimeRange(object, start, end, user) {
  return await object.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
      [Sequelize.fn("COUNT", Sequelize.col("uuid")), "count"],
    ],
    where: {
      user_id: user.id,
      createdAt: {
        [Op.between]: [start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)]
      }
    },
    group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
    order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
  })
}

async function getMeanScorePerTimeRange(object, start, end) {
  return await object.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
      [Sequelize.fn("AVG", Sequelize.col("score")), "score"],
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

async function getExercisePerTimeRange(object, start, end) {
  return await object.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
      [Sequelize.fn("SUM", Sequelize.col("duration")), "duration"],
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

export const getDashboardData = async (req, res, next) => {
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
      var usersPerDay = await getAttributesPerTimeRange(User, now, pastWeek)

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
      var mealsPerDay = await getAttributesPerTimeRange(MealRecord, now, pastWeek)

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
      var mealsPerDay = await getAttributesPerTimeRange(ExerciseRecord, now, pastWeek)

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

    if(req.query.type == "usersTable"){
      const users = await User.findAll({
        attributes: ["id", "firstName", "lastName", "phoneNumber"]
      })

      res.send({
        "success": true,
        users
      })
    }

    if(req.query.type == "userMeal"){
      const { userId } = req.query;

      const user = await User.findOne({
        where: {
          id: userId
        }
      })
  
      if(!user){
        throw createError.NotFound('User not found')
      }

      const meals = await MealRecord.findAll({
        where: {
          user_id: user.id,
        },
        attributes: ["id", "name", "type", "createdAt"],
      });
  
      res.send({
        success: true,
        meals,
      });
    }

  } catch (error) {
    next(error)
  }
}

export const getAppData = async (req, res, next) => {
  try {
    if(req.query.type == "homeScreen"){
      const user = await User.findOne({
        where: {
          uuid: req.query.uuid
        }
      })
  
      if(!user){
        throw createError.NotFound('User not found')
      }

      const today = new Date();

      var mealsPerDay = await getAttributesPerTimeRange(MealRecord, today, today, user)
      var exercisesPerDay = await getAttributesPerTimeRange(ExerciseRecord, today, today, user)

      var scoreMealsPerDay = await getMeanScorePerTimeRange(MealRecord, today, today)
      var scoreExercisesPerDay = await getMeanScorePerTimeRange(ExerciseRecord, today, today)

      var timeExercisesPerDay = await getExercisePerTimeRange(ExerciseRecord, today, today)

      if(mealsPerDay.length != 0){
        mealsPerDay = mealsPerDay[0].dataValues.count
      } else{
        mealsPerDay = "0"
      }

      if(exercisesPerDay.length != 0){
        exercisesPerDay = exercisesPerDay[0].dataValues.count
      } else{
        exercisesPerDay = "0"
      }

      if(scoreMealsPerDay.length != 0){
        scoreMealsPerDay = scoreMealsPerDay[0].dataValues.score
      } else{
        scoreMealsPerDay = 0
      }

      if(scoreExercisesPerDay.length != 0){
        scoreExercisesPerDay = scoreExercisesPerDay[0].dataValues.score
      } else{
        scoreExercisesPerDay = 0
      }

      if(timeExercisesPerDay.length != 0){
        timeExercisesPerDay = `${(timeExercisesPerDay[0].dataValues.duration / 60).toFixed(1)}h`
      } else{
        timeExercisesPerDay = "0h"
      }

      var meanScore = ((scoreMealsPerDay + scoreExercisesPerDay) / 2)

      if(meanScore <= 0.4){
        meanScore = "Bajo"
      } else if (meanScore >= 0.5 && meanScore <= 0.9){
        meanScore = "Medio Bajo"
      } else if (meanScore >= 1 && meanScore <= 1.4){
        meanScore = "Medio"
      } else if (meanScore >= 1.5 && meanScore <= 1.9){
        meanScore = "Medio Alto"
      } else {
        meanScore = "Perfecto"
      }

      res.send({
        "success": true,
        "data": {
          "score": meanScore, 
          "activeTime": timeExercisesPerDay, 
          "meals": mealsPerDay, 
          "exercises": exercisesPerDay
        }
      })
    }
  } catch (error) {
    next(error);
  }
}


export const getUserMealsChart = async (req, res, next) => {
  try {
      const { userId } = req.query;

      const meals = await MealRecord.findAll({
          where: {
              user_id: userId,
          },
          attributes: ['name', 'score', 'createdAt'],
          order: [['createdAt', 'ASC']],
      });

      const mealsData = meals.map(meal => ({
          x: meal.name,
          y: meal.score,
      }));

      res.send({
          success: true,
          meals: mealsData,
      });
  } catch (error) {
      next(error);
  }
};


export const getUserAverageScore = async (req, res, next) => {
  try {
      const { userId } = req.query;

      const averageScore = await MealRecord.findOne({
          where: {
              user_id: userId,
          },
          attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'averageScore']],
      });

      res.send({
          success: true,
          averageScore: averageScore.dataValues.averageScore,
      });
  } catch (error) {
      next(error);
  }
};

