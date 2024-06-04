import createError from 'http-errors'
import { Op } from "sequelize"
import { User, ExerciseRecord } from '#data/relations/relations.js'
import { exerciseRecordSchema, getRecordSchema } from '#validators/exercise/exerciseRecordValidation.js'

export const getExerciseRecords = async (req, res, next) => {
  try {
    const validationResult = await getRecordSchema.validateAsync(req.query);

    const user = await User.findOne({
      where: {
        uuid: validationResult.uuid
      }
    });

    if (!user) {
      throw createError.NotFound('User not found')
    }

    let start;
    let end;

    if (validationResult.range == "today") {
      start = new Date().setHours(0, 0, 0, 0);
      end = new Date(start);

      end.setDate(new Date(start).getDate() + 1);
      end.setSeconds(end.getSeconds() - 1);
    } else if (validationResult.range == "yesterday") {
      start = new Date().setHours(0, 0, 0, 0);
      start = new Date(start).setDate(new Date(start).getDate() - 1);
      end = new Date(start);

      end.setDate(new Date(start).getDate() + 1);
      end.setSeconds(end.getSeconds() - 1);
    } else {
      start = new Date(validationResult.range);
      end = new Date(start);

      end.setDate(new Date(start).getDate() + 1);
      end.setSeconds(end.getSeconds() - 1);
    }

    const records = await ExerciseRecord.findAll({
      where: {
        user_id: user.id,
        createdAt: {
          [Op.between]: [start, end]
        }
      },
      attributes: ["id", "uuid", "name", "duration", "score", "createdAt", "updatedAt"]
    });

    if (records.length === 0) {
      throw createError.NotFound("No exercise records found");
    }
    res.send({ "success": true, records });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 406;
    }
    next(error);
  }
};

export const getExerciseRecordDays = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.query.uuid
      }
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const records = await ExerciseRecord.findAll({
      where: {
        user_id: user.id
      }
    });

    const repeatedDates = records.map(record => new Date(record.createdAt.toDateString()).toISOString());
    const dates = [...new Set(repeatedDates)];
    res.send({ "success": true, dates });
  } catch (error) {
    next(error);
  }
};

export const addExerciseRecord = async (req, res, next) => {
  try {
    const result = await exerciseRecordSchema.validateAsync(req.body);

    const user = await User.findOne({
      where: {
        uuid: result.uuid
      }
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await ExerciseRecord.create({
      name: result.name,
      type: result.type,
      duration: result.duration,
      score: result.score,
      user_id: user.id
    });

    res.send({ "success": true });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 406;
    }
    next(error);
  }
};