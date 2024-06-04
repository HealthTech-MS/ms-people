import User from "#data/models/user/user.model.js"
import MealRecord from "#data/models/meal/mealrecord.model.js"
import ExerciseRecord from "#data/models/exercise/exerciserecord.model.js"

MealRecord.belongsTo(User, { foreignKey: 'user_id' })
ExerciseRecord.belongsTo(User, { foreignKey: 'user_id' })

export { User, MealRecord, ExerciseRecord}